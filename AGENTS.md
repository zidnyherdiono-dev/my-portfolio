# AGENTS.md — Website Portofolio Pribadi (my-portfolio)

Instruksi permanen untuk AI agent. Baca file ini sebelum mengubah website ini.

## Identitas Project
- Lokasi: `C:\Users\Zidny Ilham Herdiono\my-portfolio\`
- Framework: React + TypeScript + Vite + Tailwind CSS v4
- Live: https://zidny-portfolio.vercel.app (project Vercel: `my-portfolio`)
- Full-stack ringan: backend Express di `server/` (API pesan + admin), deploy Vercel
  memakai serverless function `api/index.js` (storage /tmp — pesan tidak persisten).

## Sumber Data
- `src/App.tsx` — objek `PROFILE_DATA` (semua teks profil) di bagian atas file.
- `src/data/projects.tsx` — **SUMBER DATA PROYEK (PROJECTS_DATA)** untuk section Proyek
  dan halaman detail `/projects/:id`. Tipe `Project` didefinisikan di file ini.

## Routing
- `react-router-dom` (BrowserRouter) di `src/App.tsx`:
  - `/` → beranda (Hero, Profil, Keahlian, Proyek, Kontak, Admin)
  - `/projects/:id` → halaman detail proyek, digenerate otomatis dari PROJECTS_DATA
- `vercel.json` me-rewrite route non-API ke `index.html` (SPA fallback).

## Cara Menambah / Mengubah Proyek di Portofolio
1. Edit HANYA `src/data/projects.tsx` (tambah objek di `PROJECTS_DATA`).
2. Screenshot disimpan di `public/projects/<id>.png`.
3. `status: "draft"` = tidak tampil publik; `"published"` = tampil + punya halaman detail.
4. Deploy: `npm run build && npx vercel deploy --prod --yes`
5. Verifikasi live setelah deploy (edit lokal tidak mengubah website live).

## Halaman Admin (/admin)
- Panel admin khusus di route `/admin` — terkunci kunci admin; TANPA kunci tidak ada
  data (pesan/status proyek draft) yang tampil ke publik. Login diverifikasi ke backend,
  sesi disimpan di sessionStorage (refresh tidak logout).
- Berisi: daftar pesan masuk + tombol "Publikasikan"/"Kembalikan ke Draft" per proyek.
  Tombol publikasi aman: terkunci saat menyimpan, punya cadangan status di localStorage,
  dan pembatalan publikasi butuh konfirmasi 2 langkah.
- Status disimpan di **Vercel Blob** (`project-status.json`, store `portfolio-state`) lewat
  `POST /api/project-status` — persisten antar-instance (jangan pakai /tmp).
- Cron laptop **"Portfolio Publish Sync"** (tiap 5 menit, `auto/projects-sync.py`) membaca
  state → patch `src/data/projects.tsx` → build + deploy otomatis → status permanen di kode.

## Aturan
- Jangan mengarang data proyek — hanya informasi nyata hasil implementasi.
- Privasi klien: tanpa izin publikasi → entri tetap draft.
- Jangan menimpa data project lain saat menambah entri.
- Kunci admin API default: `zidny123` (env `ADMIN_KEY` untuk mengubah).
