import { Navbar, Footer } from "@/components/navbar";
import { Checkout } from "@/components/checkout";
export default async function CheckoutPage({params}:{params:Promise<{bookingId:string}>}){const {bookingId}=await params;return <><Navbar/><main><section className="page-hero"><div className="container"><span className="eyebrow">Pembayaran aman</span><h1>Konfirmasi pemesanan</h1><p>Periksa ringkasan sebelum melanjutkan.</p></div></section><div className="container"><Checkout id={bookingId}/></div></main><Footer/></>}
