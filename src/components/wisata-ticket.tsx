"use client";
import { useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import JsBarcode from "jsbarcode";
import { Check, Copy, MapPin, Plane, Sparkles } from "lucide-react";
import { useState } from "react";
import type { DemoBooking, DemoTicket as Ticket } from "@/lib/demo-store";
import { formatRupiah } from "@/lib/destinations";

function Barcode({value}:{value:string}){const ref=useRef<SVGSVGElement>(null);useEffect(()=>{if(ref.current)JsBarcode(ref.current,value,{format:"CODE128",displayValue:false,margin:0,height:42,width:1.2,lineColor:"#064e3b"})},[value]);return <svg ref={ref} role="img" aria-label={`Código de barras ${value}`} style={{width:"100%",height:42}}/>}

export function WisataTicket({booking,ticket}:{booking:DemoBooking;ticket:Ticket}){
  const [copied,setCopied]=useState(false);
  async function copyBookingCode(){try{await navigator.clipboard.writeText(booking.code);setCopied(true);window.setTimeout(()=>setCopied(false),1800)}catch{setCopied(false)}}
  return <article className="ticket-shell" aria-label={`Tiket ${ticket.number} untuk ${ticket.visitor}`}>
    <div className="ticket-main"><svg className="leaf-watermark" viewBox="0 0 200 200" fill="currentColor" aria-hidden="true"><path d="M100 10C120 40 140 80 140 120c0 40-30 70-40 70s-40-30-40-70c0-40 20-80 40-110Zm0 40c30 5 70 30 80 60-10 15-40 5-70-15Zm0 0C70 55 30 80 20 110c10 15 40 5 70-15Zm0 40c35 10 75 40 75 70-20 5-45-10-67-35Zm0 0c-35 10-75 40-75 70 20 5 45-10 67-35Z"/></svg><Plane className="ticket-plane" size={70} strokeWidth={1} aria-hidden="true"/>
      <div className="ticket-head"><div className="brand" style={{fontSize:16}}><span className="brand-mark" style={{width:30,height:30,borderRadius:9}}><Sparkles size={16}/></span><span>Wisata<span style={{color:"#10b981"}}>Go</span></span></div><div style={{textAlign:"right"}}><small style={{display:"block",fontSize:9,color:"#64748b",letterSpacing:".12em"}}>ID TRANSAKSI</small><strong style={{font:"700 10px ui-monospace,monospace",color:"#064e3b"}}>{booking.code}</strong></div></div>
      <div className="ticket-destination"><span className="eyebrow" style={{fontSize:9}}><Sparkles size={12}/> TIKET WISATA</span><h2>{booking.destination}</h2><div className="location"><MapPin size={13}/>{booking.location}</div></div>
      <div className="ticket-data"><div><small>Tanggal Kunjungan</small><strong>{new Date(`${booking.visitDate}T00:00:00`).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"})}</strong></div><div><small>Nama Pengunjung</small><strong>{ticket.visitor}</strong></div><div><small>Kategori Tiket</small><strong>{ticket.category}</strong></div><div><small>Total Tagihan</small><strong>{formatRupiah(booking.total)}</strong></div></div>
      <div className="ticket-cs"><span>Nomor tiket <strong style={{color:"#064e3b"}}>{ticket.number}</strong></span><span>Bantuan: <strong style={{color:"#064e3b"}}>bantuan@wisatago.demo</strong></span></div>
    </div>
    <div className="ticket-divider" aria-hidden="true"/>
    <aside className="ticket-stub"><svg className="stub-leaves" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M180 180C130 130 80 80 20 20M150 150c15-20 20-45 10-60-10 15-20 30-35 40M128 128c12-20 14-46 0-60-8 20-16 34-23 42M105 105c10-20 7-47-13-57-4 20-7 37-12 44"/></svg>
      <div><h3>Bagian Sobekan / Stub</h3><small style={{display:"block",color:"#d1fae5b8",fontSize:9,marginTop:14,letterSpacing:".08em"}}>KODE PEMESANAN</small><div className="ticket-code"><span>{booking.code}</span><button type="button" onClick={copyBookingCode} aria-label="Salin kode pemesanan" title="Salin kode pemesanan" style={{display:"grid",placeItems:"center",border:0,background:"transparent",color:"#a7f3d0",cursor:"pointer",padding:2}}>{copied?<Check size={14}/>:<Copy size={14}/>}</button></div><small style={{display:"block",color:"#d1fae5b8",fontSize:9,marginTop:10,letterSpacing:".08em"}}>NOMOR TIKET</small><strong style={{display:"block",font:"700 11px ui-monospace,monospace",marginTop:3}}>{ticket.number}</strong><div style={{display:"flex",justifyContent:"space-between",marginTop:9,fontSize:10}}><span style={{color:"#d1fae5b8"}}>Status</span><strong style={{color:ticket.status==="Aktif"?"#a7f3d0":"#fde68a"}}>{ticket.status}</strong></div></div>
      <div className="code-art"><div style={{display:"grid",gridTemplateColumns:"1fr 54px",alignItems:"center",gap:8,width:"100%"}}><Barcode value={ticket.number}/>{ticket.token?<QRCodeSVG value={`wisatago://verify/${ticket.token}`} size={54} level="M" title="Kode verifikasi tiket"/>:<span style={{width:54,height:54,display:"grid",placeItems:"center",textAlign:"center",fontSize:7,color:"#64748b",background:"#f1f5f9",borderRadius:5}}>QR perlu diterbitkan ulang</span>}</div></div><p className="stub-note">Pindai kode ini di pintu masuk</p>
    </aside>
  </article>;
}
