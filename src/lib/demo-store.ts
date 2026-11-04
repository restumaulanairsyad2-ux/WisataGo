export type DemoTicket={id:string;number:string;token:string;visitor:string;category:string;status:"Aktif"|"Digunakan"|"Dibatalkan"};
export type DemoItem={name:string;price:number;quantity:number;visitors:string[]};
export type DemoBooking={id:string;code:string;slug:string;destination:string;location:string;image:string;visitDate:string;email:string;phone:string;items:DemoItem[];total:number;status:"Menunggu Pembayaran"|"Berhasil"|"Gagal";createdAt:string;tickets:DemoTicket[]};
const KEY="wisatago.demo.bookings.v1";
export function readBookings():DemoBooking[]{if(typeof window==="undefined")return[];try{return JSON.parse(localStorage.getItem(KEY)||"[]") as DemoBooking[]}catch{return[]}}
export function writeBookings(bookings:DemoBooking[]){if(typeof window!=="undefined")localStorage.setItem(KEY,JSON.stringify(bookings))}
export function saveBooking(booking:DemoBooking){const all=readBookings();const next=[booking,...all.filter(b=>b.id!==booking.id)];writeBookings(next);return booking}
export function patchBooking(id:string,update:Partial<DemoBooking>){const all=readBookings();const next=all.map(b=>b.id===id?{...b,...update}:b);writeBookings(next);return next.find(b=>b.id===id)}
export function makeId(){return globalThis.crypto?.randomUUID?.()??`${Date.now()}-${Math.random().toString(36).slice(2)}`}
export function makeCode(){return `WG-${new Date().getFullYear()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`}
