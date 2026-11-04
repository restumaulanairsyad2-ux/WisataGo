import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, Leaf, Mountain, Palmtree, Search, ShieldCheck, Sparkles, Ticket, TreePalm, Waves } from "lucide-react";
import { Navbar, Footer } from "@/components/navbar";
import { PopularDestinations } from "@/components/popular-destinations";

const categories = [
  {name:"Wisata Alam",icon:Leaf},{name:"Pantai",icon:Waves},{name:"Pegunungan",icon:Mountain},{name:"Wisata Budaya",icon:Sparkles},
  {name:"Wisata Sejarah",icon:Compass},{name:"Taman Hiburan",icon:Ticket},{name:"Wisata Edukasi",icon:TreePalm},{name:"Wisata Keluarga",icon:Palmtree},
];

export default function Home() {
  return <><Navbar/><main>
    <section className="hero"><div className="container hero-grid"><div>
      <span className="eyebrow"><Sparkles size={14}/> Temukan pengalaman baru</span>
      <h1>Jelajahi Indonesia, pesan tiket wisata dengan mudah</h1>
      <p className="hero-copy">Temukan destinasi alam, budaya, dan rekreasi pilihan. Rencanakan perjalananmu dan simpan tiket digital dalam satu tempat.</p>
      <form className="search-box" action="/wisata"><label className="search-input"><Search size={19} color="#64748b"/><input name="q" placeholder="Cari destinasi atau kota..." aria-label="Cari destinasi atau kota"/></label><button className="btn btn-primary" type="submit">Cari wisata <ArrowRight size={16}/></button></form>
      <div className="trust-row"><span><ShieldCheck size={15} color="#047857"/> Pemesanan praktis</span><span><Ticket size={15} color="#047857"/> Tiket digital</span><span><Leaf size={15} color="#047857"/> Pilihan lokal</span></div>
      </div><div className="hero-art"><Image src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85" alt="Pemandangan pura dan alam tropis Indonesia" fill priority sizes="(max-width: 680px) 100vw, 45vw" style={{objectFit:"cover"}}/><div className="image-caption"><strong>Perjalanan dimulai di sini</strong><span>Temukan keindahan Indonesia</span></div></div></div></section>
    <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">Pilihan perjalanan</span><h2>Destinasi populer</h2><p>Tempat menarik untuk mengisi rencana perjalananmu.</p></div><Link className="text-link" href="/wisata">Lihat semua <ArrowRight size={16}/></Link></div><PopularDestinations/></div></section>
    <section className="section" style={{background:"#f0f6f2"}}><div className="container"><div className="section-head"><div><span className="eyebrow">Temukan yang kamu suka</span><h2>Jelajahi berdasarkan kategori</h2><p>Dari pantai yang tenang sampai pengalaman budaya.</p></div></div><div className="category-grid">{categories.map(({name,icon:Icon})=><Link key={name} className="category-item" href={`/wisata?kategori=${encodeURIComponent(name)}`}><span className="category-icon"><Icon size={19}/></span>{name}</Link>)}</div></div></section>
    <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">Mudah dari awal sampai berangkat</span><h2>Bagaimana WisataGo bekerja?</h2></div></div><div className="steps"><article className="step-card"><span className="step-num">1</span><h3>Pilih destinasi</h3><p>Temukan tempat yang ingin kamu kunjungi dari berbagai pilihan wisata Indonesia.</p></article><article className="step-card"><span className="step-num">2</span><h3>Pesan tiket</h3><p>Pilih tanggal, kategori tiket, dan jumlah pengunjung sesuai rencana.</p></article><article className="step-card"><span className="step-num">3</span><h3>Nikmati wisata</h3><p>Simpan tiket digitalmu dan tunjukkan kode saat tiba di lokasi.</p></article></div></div></section>
    <section className="section" style={{paddingTop:0}}><div className="container"><div className="cta-band"><div><h2>Sudah punya tujuan berikutnya?</h2><p>Jelajahi berbagai destinasi dan mulai susun perjalananmu.</p></div><Link className="btn" href="/wisata">Jelajahi wisata <ArrowRight size={16}/></Link></div></div></section>
  </main><Footer/></>;
}
