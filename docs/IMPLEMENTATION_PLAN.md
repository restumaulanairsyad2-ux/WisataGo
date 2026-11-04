# Rencana Implementasi WisataGo

## Acuan desain

Gambar acuan adalah tiket horizontal 1774 × 887 px: badan putih lebar di kiri, stub hijau gelap di kanan, pembatas vertikal putus-putus dengan takikan, logo dan ID transaksi di bagian atas, judul destinasi dan detail kunjungan di tengah, lalu kode tiket, barcode, dan QR pada stub. HTML sumber menggunakan Plus Jakarta Sans dan watermark dedaunan. Komponen `WisataTicket` mempertahankan struktur tersebut dan menampilkan data tiap pengunjung.

## Tahapan dan status

| Tahap | Cakupan | Status |
|---|---|---|
| 1–2 | Next.js App Router, TypeScript, Tailwind, font, palet emerald, komponen navigasi dan tiket | Selesai |
| 3 | Beranda, kategori, katalog, pencarian, filter, pengurutan, halaman detail | Selesai; katalog memakai data seed saat mode demo dan route database jika Supabase tersedia |
| 4 | Migrasi PostgreSQL, RLS, role, seed, helper Auth Supabase | Selesai sebagai sumber dan route; perlu URL/key proyek untuk menjalankan |
| 5 | Booking beberapa jenis tiket, hitung harga server, reservasi kuota, idempotency | Demo lokal berfungsi; RPC Supabase disiapkan, perlu konfigurasi dan data seed |
| 6 | Sukses/gagal pembayaran simulasi, terbitkan tiket setelah pembayaran | Mode lokal berfungsi; RPC server dipagari `DEMO_PAYMENT_ENABLED` |
| 7–8 | E-ticket dinamis, QR, barcode, PDF, cetak | Selesai untuk alur demo browser |
| 9 | Daftar tiket dan profil | Selesai untuk demo lokal; daftar tiket memiliki route database; pemulihan QR pada perangkat lain membutuhkan alur token aman tambahan |
| 10 | Ringkasan admin, tabel pesanan, CRUD destinasi | Selesai pada jalur Supabase; perlu kredensial dan akun role admin untuk uji database |
| 11 | Kamera/pemeriksaan kode dan check-in atomik | Demo browser dan RPC Supabase tersedia; perlu kredensial untuk uji database |
| 12 | Responsif, fokus keyboard, reduced motion, skeleton dan status | Selesai pada komponen yang dibangun |
| 13 | Lint, typecheck, unit test, production build | Lulus; UI end-to-end tidak dijalankan karena browser tidak dapat membuka server lokal |
| 14 | README, env example, seed, migrasi, CI, panduan deployment | Selesai |

## Batas integrasi

Mode demonstrasi tanpa kredensial menyimpan pesanan pada `localStorage`. Ini berguna untuk presentasi satu browser dan bukan backend produksi. Booking, pembayaran demo, validasi, Auth, katalog, daftar tiket, dashboard, pesanan, serta CRUD destinasi memiliki jalur server Supabase, tetapi belum dapat diuji tanpa proyek Supabase. Penyimpanan/penerbitan ulang token QR lintas perangkat, Midtrans, upload gambar melalui Storage, pengiriman email, serta rate limiting terdistribusi masih pekerjaan lanjutan.
