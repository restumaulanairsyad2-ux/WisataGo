import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DestinationDetails } from "@/components/destination-details";
import { destinations } from "@/lib/destinations";
import { isSupabaseConfigured } from "@/lib/supabase/client";
export function generateStaticParams(){return destinations.map(d=>({slug:d.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const d=destinations.find(x=>x.slug===slug);return {title:d?.name??"Destinasi wisata",description:d?.description??"Lihat informasi dan tiket destinasi wisata Indonesia di WisataGo."};}
export default async function DestinationDetail({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const d=destinations.find(x=>x.slug===slug)??null;if(!d&&!isSupabaseConfigured)return notFound();return <DestinationDetails slug={slug} initial={d}/>;}
