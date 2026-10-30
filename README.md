
# ECO-CAHAYA
**ECO-CAHAYA** adalah platform web interaktif untuk bank sampah yang mengintegrasikan pencatatan timbangan sampah berbasis insentif sirkular, kalkulator estimasi emisi terhindarkan (*avoided emissions*), pengelolaan batch tabungan emas Pegadaian, serta etalase digital produk kriya daur ulang lokal.

---

## Fitur Utama

1. **Pencatatan Setoran & Kalkulator Emisi Otomatis**: Membantu pengurus mencatat berat dan jenis sampah nasabah, lalu mengonversinya secara otomatis menjadi nilai saldo rupiah dan estimasi emisi terhindarkan.


2. **Green Incentive Gamification & Tier Badge**: Sistem insentif berbasis level keaktifan (*tier badge*) untuk memotivasi warga aktif memilah sampah.


3. **Smart-Batch Voucher Tabungan Emas Pegadaian**: Modul administrasi bagi pengurus untuk merekapitulasi pengajuan konversi tabungan emas secara kolektif (kelipatan Rp 50.000) menuju Pegadaian Situbondo.


4. **Generator Laporan Adipura & DLH**: Fitur rekapitulasi data setoran bulanan siap cetak yang disesuaikan dengan format evaluasi Dinas Lingkungan Hidup.


5. **Etalase Digital Kriya Lokal**: Katalog produk daur ulang (seperti Tas SEDAJA, Sabun Jelantah, dan *Eco-Enzyme*) yang terhubung langsung dengan pengurus via WhatsApp.



---

## Teknologi yang Digunakan

* **Frontend**: React.js (Vite), Tailwind CSS, React Router DOM, Lucide React


* **Backend & Database**: Supabase Relational Database (PostgreSQL) dengan Row Level Security (RLS)


* **Hosting & Deployment**: Netlify & GitHub

---

## Menjalankan Proyek Secara Lokal

Ikuti langkah-langkah berikut untuk menjalankan kode proyek di komputer Anda:

1. **Clone repository ini:**
```bash
git clone https://github.com/nencyy-ell/eco_cahaya.git
cd eco-cahaya

```


2. **Installdependencies:**
```bash
npm install

```


3. **Konfigurasi Environment Variable:**
Buat file `.env` di root direktori proyek, lalu masukkan konfigurasi Supabase Anda:
```env
VITE_SUPABASE_URL=URL_SUPABASE_ANDA
VITE_SUPABASE_ANON_KEY=ANON_KEY_SUPABASE_ANDA

```


4. **Jalankan server lokal:**
```bash
npm run dev

```


5. Buka tautan lokal yang muncul di terminal (biasanya `http://localhost:5173`) melalui browser Anda.

---

## Struktur Migrasi Database

Skrip SQL untuk migrasi basis data dan fungsi kustom (termasuk pemicu akun warga dan manajemen stok pesanan) telah disediakan di dalam folder migrasi proyek, yaitu file `202610280001_bank_operations.sql` dan `202610290001_activate_resident_accounts.sql` yang dapat dieksekusi melalui **Supabase SQL Editor**.

---

## Tautan Publik

* **Live Website**: [https://ecocahaya.netlify.app/](https://ecocahaya.netlify.app/)


* **Repositori GitHub**: [https://github.com/nencyy-ell/eco_cahaya.git](https://github.com/nencyy-ell/eco_cahaya.git)
