import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema=z.object({slug:z.string().min(1).max(100),visitDate:z.string().date(),email:z.string().email().max(254),phone:z.string().min(8).max(24),requestKey:z.string().uuid(),items:z.array(z.object({name:z.string().min(1),quantity:z.number().int().min(1).max(10),visitors:z.array(z.string().trim().min(1).max(120)).min(1).max(10)})).min(1).max(8)}).superRefine((value,ctx)=>{const names=value.items.map(i=>i.name);if(new Set(names).size!==names.length)ctx.addIssue({code:"custom",message:"Jenis tiket tidak boleh berulang."})});
export async function POST(request:Request){
  if(!process.env.NEXT_PUBLIC_SUPABASE_URL||!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)return NextResponse.json({error:"Supabase belum dikonfigurasi."},{status:503});
  try{
    const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Data pemesanan tidak valid."},{status:400});
    const sb=await createSupabaseServerClient();const {data:{user},error:authError}=await sb.auth.getUser();if(authError||!user)return NextResponse.json({error:"Masuk terlebih dahulu untuk membuat pemesanan."},{status:401});
    const input=parsed.data;const {data:dest,error:destError}=await sb.from("destinations").select("id,name,location").eq("slug",input.slug).eq("status","active").single();if(destError||!dest)return NextResponse.json({error:"Destinasi tidak ditemukan."},{status:404});
    const {data:types,error:typeError}=await sb.from("ticket_types").select("id,name").eq("destination_id",dest.id).eq("is_active",true);if(typeError||!types)return NextResponse.json({error:"Jenis tiket belum tersedia."},{status:409});
    const items=input.items.map(item=>{const type=types.find(t=>t.name===item.name);if(!type)throw new Error(`Jenis tiket ${item.name} tidak tersedia.`);if(item.visitors.length!==item.quantity)throw new Error("Jumlah nama pengunjung harus sama dengan jumlah tiket.");return {ticket_type_id:type.id,quantity:item.quantity,visitors:item.visitors}});
    const {data,error}=await sb.rpc("create_booking",{p_destination_slug:input.slug,p_visit_date:input.visitDate,p_contact_email:input.email,p_contact_phone:input.phone,p_items:items,p_request_key:input.requestKey});if(error)throw error;
    const bookingId=(data as {id:string}).id;const {data:booking}=await sb.from("bookings").select("id,booking_code,total_amount,visit_date,expires_at").eq("id",bookingId).single();const {data:savedItems}=await sb.from("booking_items").select("quantity,unit_price,ticket_types(name),booking_visitors(visitor_name)").eq("booking_id",bookingId);
    return NextResponse.json({booking:{...booking,code:booking?.booking_code,destination:dest.name,location:dest.location,email:input.email,phone:input.phone,visitDate:booking?.visit_date,total:booking?.total_amount,status:"Menunggu Pembayaran",items:(savedItems??[]).map(item=>({name:(Array.isArray(item.ticket_types)?item.ticket_types[0]:item.ticket_types)?.name??"Tiket",quantity:item.quantity,price:item.unit_price,visitors:(item.booking_visitors??[]).map(visitor=>visitor.visitor_name)})),tickets:[]}});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Pemesanan gagal dibuat."},{status:400})}
}
