import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin, Star } from "lucide-react";
import type { Destination } from "@/lib/destinations";
import { formatRupiah } from "@/lib/destinations";

export function DestinationCard({ destination }: { destination: Destination }) {
  return <article className="destination-card">
    <Link href={`/wisata/${destination.slug}`} aria-label={`Lihat detail ${destination.name}`}>
      <div className="destination-image"><Image src={destination.image} alt={`Pemandangan ${destination.name}`} fill sizes="(max-width: 680px) 100vw, (max-width: 900px) 50vw, 33vw" style={{objectFit:"cover"}}/><span className="category-pill">{destination.category}</span><span className="rating-pill"><Star size={12} fill="currentColor" style={{display:"inline",marginRight:4}}/>{destination.rating}</span></div>
    </Link>
    <div className="destination-content"><Link href={`/wisata/${destination.slug}`}><h3>{destination.name}</h3></Link><div className="location"><MapPin size={13}/>{destination.location}</div><div className="destination-foot"><div><span className="price-label">Tiket mulai dari</span><span className="price">{destination.price===0?"Gratis":formatRupiah(destination.price)}</span></div><Link className="card-link" href={`/wisata/${destination.slug}`} aria-label={`Lihat ${destination.name}`}><ArrowUpRight size={18}/></Link></div></div>
  </article>;
}
