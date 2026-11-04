import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/navbar";
import { Catalog } from "@/components/catalog";
export const metadata: Metadata = { title: "Jelajahi Wisata" };
export default async function WisataPage({searchParams}:{searchParams:Promise<{q?:string;kategori?:string}>}) {
  const params=await searchParams;
  return <><Navbar/><main><section className="page-hero"><div className="container"><span className="eyebrow">Inspirasi perjalanan</span><h1>Jelajahi wisata Indonesia</h1><p>Pilih tempat, temukan pengalaman, dan rencanakan kunjunganmu.</p></div></section><div className="container section" style={{paddingTop:16}}><Catalog initialQuery={params.q??""} initialCategory={params.kategori??"Semua"}/></div></main><Footer/></>;
}
