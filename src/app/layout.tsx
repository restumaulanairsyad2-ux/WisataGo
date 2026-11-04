import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "WisataGo — Jelajahi Indonesia", template: "%s | WisataGo" },
  description: "Temukan destinasi wisata Indonesia dan pesan tiket digital dengan mudah bersama WisataGo.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
