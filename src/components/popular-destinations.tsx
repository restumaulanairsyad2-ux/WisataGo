"use client";
import { useEffect,useState } from "react";
import { DestinationCard } from "@/components/destination-card";
import { destinations,type Destination } from "@/lib/destinations";
import { isSupabaseConfigured } from "@/lib/supabase/client";
export function PopularDestinations(){
  const [items,setItems]=useState<Destination[]>(destinations.slice(0,6));
  const [loading,setLoading]=useState(isSupabaseConfigured);
  useEffect(()=>{
    if(!isSupabaseConfigured)return;
    let canceled=false;
    fetch("/api/destinations").then(r=>r.json()).then(data=>{
      if(!canceled&&Array.isArray(data.destinations))setItems(data.destinations.slice(0,6));
    }).catch(()=>{}).finally(()=>{if(!canceled)setLoading(false)});
    return()=>{canceled=true};
  },[]);
  if(loading)return <div className="destination-grid">{[1,2,3].map(n=><div key={n} className="skeleton" style={{height:340}}/>)}</div>;
  return <div className="destination-grid">{items.map(d=><DestinationCard key={d.slug} destination={d}/>)}</div>;
}
