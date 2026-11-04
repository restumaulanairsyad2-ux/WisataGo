import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
export async function GET(){const sb=await createSupabaseServerClient();const {data:{user}}=await sb.auth.getUser();if(!user)return NextResponse.json({role:null},{status:401});const {data}=await sb.from("profiles").select("full_name,role").eq("id",user.id).single();return NextResponse.json({role:data?.role??"user",name:data?.full_name??"",email:user.email})}
