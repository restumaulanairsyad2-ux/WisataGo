"use client";
import { useEffect,useRef,useState } from "react";
import { Camera, CameraOff, Search, CheckCircle2, CircleAlert, CircleX } from "lucide-react";
import { readBookings,writeBookings,type DemoBooking,type DemoTicket } from "@/lib/demo-store";
import { isSupabaseConfigured } from "@/lib/supabase/client";

type DetectionResult={rawValue:string};type Detector={detect:(source:ImageBitmapSource)=>Promise<DetectionResult[]>};type DetectorCtor=new(options:{formats:string[]})=>Detector;
export function TicketValidator(){const [code,setCode]=useState("");const [result,setResult]=useState<{kind:string;text:string;booking?:DemoBooking;ticket?:DemoTicket}|null>(null);const [camera,setCamera]=useState(false);const [cameraError,setCameraError]=useState("");const video=useRef<HTMLVideoElement>(null);const stream=useRef<MediaStream|null>(null);
  useEffect(()=>{let active=true;let timer:ReturnType<typeof setTimeout>;async function scan(){if(!camera||!video.current)return;try{const Ctor=(window as unknown as {BarcodeDetector?:DetectorCtor}).BarcodeDetector;if(!Ctor){setCameraError("Pemindai otomatis belum didukung browser ini. Masukkan kode tiket secara manual.");return}const detector=new Ctor({formats:["qr_code","code_128"]});if(video.current.readyState>=2){const found=await detector.detect(video.current);if(found[0]?.rawValue){setCode(found[0].rawValue);setCamera(false);stream.current?.getTracks().forEach(track=>track.stop());stream.current=null;return}}}catch{setCameraError("Kamera tidak dapat digunakan. Periksa izin browser atau masukkan kode secara manual.");return}if(active)timer=setTimeout(scan,400)}void scan();return()=>{active=false;clearTimeout(timer)}},[camera]);
  useEffect(()=>()=>{stream.current?.getTracks().forEach(t=>t.stop())},[]);
  async function startCamera(){setCameraError("");try{stream.current=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});if(video.current){video.current.srcObject=stream.current;await video.current.play()}setCamera(true)}catch{setCameraError("Izin kamera ditolak atau kamera tidak tersedia.")}}
  function stopCamera(){setCamera(false);stream.current?.getTracks().forEach(t=>t.stop());stream.current=null}
  async function validate(e:React.FormEvent){e.preventDefault();const raw=code.trim();if(isSupabaseConfigured){try{const response=await fetch("/api/admin/validate-ticket",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:raw})});const data=await response.json();if(!response.ok)throw new Error(data.error??"Validasi gagal.");const kinds:Record<string,{kind:string;text:string}>={valid:{kind:"valid",text:"Tiket valid. Check-in berhasil dicatat."},used:{kind:"used",text:"Tiket ini sudah pernah digunakan."},cancelled:{kind:"cancelled",text:"Tiket dibatalkan atau belum lunas."},wrong_date:{kind:"wrong-date",text:"Tanggal kunjungan tiket ini bukan hari ini."},invalid:{kind:"invalid",text:"Kode tiket tidak ditemukan."}};setResult({...kinds[data.result]??kinds.invalid,booking:undefined,ticket:undefined});return}catch(error){setResult({kind:"invalid",text:error instanceof Error?error.message:"Validasi tiket gagal."});return}}const token=raw.startsWith("wisatago://verify/")?raw.split("/").pop():raw;const bookings=readBookings();for(const b of bookings){for(const t of b.tickets){if(t.number.toLowerCase()===raw.toLowerCase()||t.token===token){if(t.status==="Digunakan"){setResult({kind:"used",text:"Tiket ini sudah pernah digunakan.",booking:b,ticket:t});return}if(t.status==="Dibatalkan"||b.status!=="Berhasil"){setResult({kind:"cancelled",text:"Tiket dibatalkan atau belum lunas.",booking:b,ticket:t});return}if(b.visitDate!==new Date().toLocaleDateString("en-CA")){setResult({kind:"wrong-date",text:`Tanggal kunjungan berbeda. Tiket berlaku pada ${new Date(`${b.visitDate}T00:00:00`).toLocaleDateString("id-ID",{dateStyle:"long"})}.`,booking:b,ticket:t});return}const next=bookings.map(x=>x.id!==b.id?x:{...x,tickets:x.tickets.map(y=>y.id===t.id?{...y,status:"Digunakan" as const}:y)});writeBookings(next);setResult({kind:"valid",text:"Tiket valid. Check-in berhasil dicatat.",booking:b,ticket:{...t,status:"Digunakan"}});return}}}setResult({kind:"invalid",text:"Kode tiket tidak ditemukan."})}
  const color=result?.kind==="valid"?"#047857":result?.kind==="used"||result?.kind==="wrong-date"?"#b45309":"#b91c1c";const Icon=result?.kind==="valid"?CheckCircle2:result?.kind==="used"||result?.kind==="wrong-date"?CircleAlert:CircleX;
  return (
    <div className="form-card" style={{maxWidth:760,margin:"24px 0"}}>
      <span className="eyebrow">Pintu masuk destinasi</span>
      <h1 style={{fontSize:24,color:"#022c22",margin:"7px 0 4px"}}>Validasi tiket</h1>
      <p style={{fontSize:13,color:"#64748b"}}>Pindai QR tiket atau masukkan nomor tiket.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:20}}>
        <div>
          <video ref={video} aria-label="Kamera pemindai tiket" style={{width:"100%",aspectRatio:"4/3",background:"#0f172a",borderRadius:12,objectFit:"cover"}}/>
          <button className="btn btn-outline" style={{width:"100%",marginTop:9}} onClick={camera?stopCamera:startCamera}>{camera?<CameraOff size={16}/>:<Camera size={16}/>} {camera?"Matikan kamera":"Aktifkan kamera"}</button>
          {cameraError&&<p role="alert" style={{fontSize:11,color:"#b91c1c"}}>{cameraError}</p>}
        </div>
        <div>
          <form onSubmit={validate}>
            <div className="form-group"><label htmlFor="ticket-code">Nomor tiket atau kode QR</label><input id="ticket-code" value={code} onChange={e=>setCode(e.target.value)} placeholder="WG-2026-XXXXXX" required autoComplete="off"/></div>
            <button className="btn btn-primary" type="submit" style={{width:"100%"}}><Search size={16}/> Periksa tiket</button>
          </form>
          {result&&<div role="status" style={{marginTop:17,padding:14,borderRadius:12,background:result.kind==="valid"?"#ecfdf5":"#fffbeb",color,border:result.kind==="valid"?"1px solid #a7f3d0":"1px solid #fde68a"}}>
            <strong style={{display:"flex",gap:7,alignItems:"center"}}><Icon size={18}/>{result.text}</strong>
            {result.booking&&result.ticket&&<dl style={{fontSize:11,display:"grid",gridTemplateColumns:"90px 1fr",gap:5,marginBottom:0}}><dt>Pengunjung</dt><dd style={{margin:0}}>{result.ticket.visitor}</dd><dt>Destinasi</dt><dd style={{margin:0}}>{result.booking.destination}</dd><dt>Kategori</dt><dd style={{margin:0}}>{result.ticket.category}</dd><dt>Kode tiket</dt><dd style={{margin:0}}>{result.ticket.number}</dd></dl>}
          </div>}
        </div>
      </div>
      <p style={{fontSize:10,color:"#94a3b8",marginBottom:0,marginTop:18}}>Validasi mode demo menggunakan penyimpanan browser. Validasi produksi harus memakai RPC Supabase dengan pembaruan atomik.</p>
    </div>
  );
}
