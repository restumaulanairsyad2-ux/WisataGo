# WisataGo

WisataGo adalah proyek pembelajaran pemesanan tiket wisata Indonesia. Aplikasi memakai Next.js App Router, TypeScript, Tailwind CSS, Supabase, dan PostgreSQL. Antarmuka dan alur demo menggunakan Bahasa Indonesia.

## Fitur yang tersedia

- Beranda emerald, navigasi responsif, pencarian, kategori, dan katalog 20 destinasi contoh.
- Detail destinasi, harga tiket demonstrasi, pemesanan lebih dari satu kategori, data pengunjung, dan ringkasan total.
- Pembayaran simulasi berhasil/gagal tanpa uang asli. Pembayaran berhasil menerbitkan satu tiket untuk setiap pengunjung.
- E-ticket React dinamis dengan QR SVG dan barcode Code 128, cetak, PDF per booking, dan validasi ulang.
- Pendaftaran/masuk Supabase Auth bila kredensial tersedia; mode browser lokal agar alur dapat dicoba tanpa kredensial.
- Dashboard, daftar pesanan, dan CRUD destinasi admin terhubung ke Supabase saat kredensial tersedia; tanpa kredensial, aplikasi menyediakan mode presentasi lokal.
- Migrasi PostgreSQL dengan RLS, reservasi kuota terkunci, RPC pembayaran demo, check-in atomik, log check-in dan seed 20 destinasi.
- Pengujian unit hitung harga, ESLint, TypeScript, dan GitHub Actions.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Supabase Auth/PostgreSQL · Zod · React Hook Form · Lucide · QRCode · JsBarcode · jsPDF · html2canvas · Vitest.

## Menjalankan secara lokal

Gunakan Node.js 22 atau lebih baru.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`. Tanpa kredensial Supabase, katalog menggunakan data contoh dan pemesanan disimpan pada `localStorage` browser. Masuk demo admin:

- Email: `admin@wisatago.demo`
- Kata sandi: `WisataGo123!`

Akun demo hanya untuk presentasi lokal. Jangan menganggapnya sebagai autentikasi aman untuk deployment.

## Mengaktifkan Supabase

1. Buat proyek Supabase, salin `.env.example` menjadi `.env.local`, lalu isi URL dan anon key.
2. Jalankan `supabase/migrations/202611040001_init.sql` pada SQL Editor.
3. Jalankan `supabase/seed.sql` untuk mengisi kategori, destinasi, tiket, dan kuota demonstrasi.
4. Buat akun admin melalui Supabase Auth, lalu ubah role profil tersebut secara manual di SQL Editor:

   ```sql
   update public.profiles set role = 'admin' where id = '<UUID akun admin>';
   ```

5. Untuk mencoba pembayaran, set `DEMO_PAYMENT_ENABLED=true` pada `.env.local`, restart server, lalu gunakan akun Supabase terdaftar. Variabel ini hanya untuk lingkungan demonstrasi.

Jangan masukkan `service_role` key ke browser. Route server memakai anon key bersama session Auth dan RLS. Unggah gambar destinasi menggunakan bucket `destination-images` setelah bucket storage dibuat pada proyek Supabase.

## Alur demo

1. Buka katalog dan pilih destinasi.
2. Pilih tanggal, jumlah tiket dewasa/anak, dan isi nama setiap pengunjung.
3. Lanjut ke checkout. Dalam mode tanpa Supabase, tombol demo berhasil menerbitkan tiket. Dalam mode Supabase, aktifkan `DEMO_PAYMENT_ENABLED=true`.
4. Buka **Tiket Saya**, cetak tiket, atau unduh PDF.
5. Untuk pengujian validasi mode lokal, pilih tanggal hari ini, masuk sebagai admin demo, lalu masukkan nomor tiket pada `/admin/validasi`. Validasi kedua atas tiket yang sama akan ditolak.
6. Untuk mode Supabase, login admin yang telah diset role `admin`, pindai QR atau masukkan nomor tiket. Validasi hanya menerima tiket untuk tanggal hari ini dan RPC mencegah check-in ganda.

## Perintah pemeriksaan

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Arsitektur ringkas

- `src/app`: halaman App Router, Route Handlers, auth, booking, checkout, admin.
- `src/components`: komponen navigasi, katalog, form, e-ticket, dan validasi.
- `src/lib/destinations.ts`: seed tampilan demo dengan harga yang bukan harga resmi.
- `src/lib/demo-store.ts`: penyimpanan demo lokal khusus browser.
- `src/lib/supabase`: klien Supabase browser dan server.
- `supabase/migrations`: skema, indeks, RLS, reservasi kuota, penerbitan tiket, dan validasi.
- `supabase/seed.sql`: 20 tujuan wisata dan kuota demo.

Alur pengguna: pilih destinasi → pilih tanggal dan kategori → reservasi tiket → demo payment → tiket unik → check-in.

Alur admin: login dengan role admin → lihat pesanan → scan QR/masukkan kode → validasi tanggal/status → catat check-in dan audit.

## Dokumentasi untuk presentasi

Rencana implementasi dan status tiap tahap ada di [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md).

**Latar belakang:** pembelian tiket destinasi melalui beberapa kanal dapat membuat informasi harga, jumlah pengunjung, dan bukti masuk sulit ditemukan.

**Masalah:** pengunjung membutuhkan cara ringkas untuk menemukan destinasi, memilih beberapa kategori tiket, dan menunjukkan bukti masuk; pengelola perlu mengecek tiket yang sama agar tidak dipakai dua kali.

**Tujuan:** membuat contoh alur tiket wisata end-to-end dan memperlihatkan penggunaan UI responsif, autentikasi, basis data relasional, validasi server, serta QR/barcode.

**Relasi utama:** satu user memiliki banyak booking; booking memiliki beberapa booking item; setiap item punya jenis tiket dan pengunjung; satu pengunjung memperoleh satu tiket; check-in menghubungkan tiket dan admin.

**Keamanan yang disiapkan:** RLS, role admin di profil, harga dihitung dari database melalui RPC, reserved quota dikunci saat booking, tiket disimpan dengan hash token, endpoint demo payment membatasi ke pemilik booking, dan check-in memakai transaksi atomik.

**Keterbatasan saat ini:** tanpa kredensial, mode lokal memakai `localStorage` dan bukan backend/database; sesi admin lokal hanya simulasi. Jalur katalog, booking, pembayaran demo, tiket, validasi, ringkasan admin, pesanan, serta CRUD destinasi Supabase tersedia, tetapi belum diuji terhadap proyek Supabase nyata. Token QR disimpan sebagai hash di database sehingga pemulihan QR lintas perangkat memerlukan mekanisme penerbitan ulang yang aman. Kamera otomatis bergantung dukungan `BarcodeDetector`. Midtrans, pengiriman email reset password, upload Storage dari formulir admin, rate limiting terdistribusi, dan pengujian browser end-to-end belum diaktifkan. Harga, rating, jam, dan kuota adalah data contoh, bukan informasi resmi.

**Pengembangan berikutnya:** hubungkan katalog dan dashboard langsung ke Supabase, tambah CRUD admin penuh, pindahkan semua operasi demo ke backend, pasang Midtrans Sandbox, tambah rate limiting terdistribusi, dan otomasi uji browser.

## Deployment Vercel

Hubungkan repository GitHub ke Vercel, set environment variables dari `.env.example` pada project settings, lalu deploy. Jalankan migrasi dan seed pada proyek Supabase terlebih dahulu. Jangan aktifkan mode demo pembayaran pada lingkungan produksi publik.

## Screenshot

Tambahkan screenshot aplikasi di sini setelah menjalankan proyek, misalnya `docs/screenshots/homepage.png` dan `docs/screenshots/ticket.png`.

## Lisensi

Belum ditambahkan. Pemilik proyek dapat memilih lisensi sebelum publikasi.
