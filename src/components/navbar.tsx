"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="container header-inner">
    <Link className="brand" href="/" aria-label="WisataGo, beranda"><span className="brand-mark"><Sparkles size={19}/></span><span>Wisata<span style={{color:"#10b981"}}>Go</span></span></Link>
    <nav className={`nav-links ${open ? "is-open" : ""}`} aria-label="Navigasi utama">
      <Link href="/" onClick={()=>setOpen(false)}>Beranda</Link><Link href="/wisata" onClick={()=>setOpen(false)}>Jelajahi Wisata</Link><Link href="/tiket-saya" onClick={()=>setOpen(false)}>Tiket Saya</Link>
    </nav>
    <div className="nav-actions"><Link className="btn btn-primary" href="/login">Masuk</Link><button className="mobile-toggle" aria-label={open?"Tutup menu":"Buka menu"} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X size={20}/>:<Menu size={20}/>}</button></div>
  </div></header>;
}

export function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-grid">
    <div><Link className="brand" href="/"><span className="brand-mark"><Sparkles size={18}/></span><span>Wisata<span style={{color:"#10b981"}}>Go</span></span></Link><p>Temukan cerita baru di setiap perjalanan. Pesan tiket destinasi Indonesia dengan cara yang mudah.</p></div>
    <div><h4>Jelajahi</h4><Link href="/wisata">Semua destinasi</Link><Link href="/wisata?kategori=Pantai">Wisata pantai</Link><Link href="/wisata?kategori=Wisata%20Budaya">Wisata budaya</Link></div>
    <div><h4>Bantuan</h4><Link href="/tiket-saya">Tiket saya</Link><a href="mailto:bantuan@wisatago.demo">Hubungi kami</a><Link href="/admin">Area admin demo</Link></div>
    <div><h4>Tentang</h4><p>Proyek pembelajaran</p><p>Harga dan ketersediaan adalah data demonstrasi.</p></div>
  </div><div className="footer-bottom"><span>© 2026 WisataGo. Proyek demonstrasi pembelajaran.</span><span>Dibuat untuk menjelajahi Indonesia 🌿</span></div></div></footer>;
}
