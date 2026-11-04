import { Navbar, Footer } from "@/components/navbar";
import { AdminGate } from "@/components/admin-gate";
export default function AdminLayout({children}:{children:React.ReactNode}){return <><Navbar/><AdminGate>{children}</AdminGate><Footer/></>}
