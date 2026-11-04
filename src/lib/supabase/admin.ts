import { createSupabaseServerClient } from "@/lib/supabase/server";
export async function requireAdmin(){const sb=await createSupabaseServerClient();const {data:{user}}=await sb.auth.getUser();if(!user)return {sb,user:null,ok:false};const {data}=await sb.from("profiles").select("role").eq("id",user.id).single();return {sb,user,ok:data?.role==="admin"};}
