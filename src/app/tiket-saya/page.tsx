import { Navbar, Footer } from "@/components/navbar";
import { MyTickets } from "@/components/my-tickets";
export default function TicketsPage(){return <><Navbar/><main><section className="page-hero"><div className="container"><span className="eyebrow">Satu tempat untuk perjalananmu</span><h1>Tiket saya</h1><p>Lihat, cetak, atau simpan tiket digital WisataGo.</p></div></section><section className="section"><div className="container"><MyTickets/></div></section></main><Footer/></>}
