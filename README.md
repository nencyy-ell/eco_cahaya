# ECO-CAHAYA

Aplikasi pengelolaan Bank Sampah Cahaya Kerja berbasis React, Vite, dan Supabase.

## Menjalankan aplikasi

```sh
npm install
npm run dev
```

## Menyiapkan database Supabase

Sebelum menggunakan versi aplikasi ini, jalankan migration berikut satu kali melalui **Supabase Dashboard → SQL Editor**:

`supabase/migrations/202610280001_bank_operations.sql`

Migration menambahkan autentikasi/approval akun warga, saldo dan permintaan penukaran, stok produk/pesanan, pergerakan stok sampah, pengaturan informasi publik, serta kebijakan Row Level Security. Migration mengganti kebijakan RLS pada `products_db`, `orders`, `prices`, `deposits`, `gold_batches`, dan `sembako_requests`; dua tabel penukaran lama dibuat tidak tersedia langsung setelah datanya disalin ke tabel baru. Cadangkan database dan uji di project staging terlebih dahulu. Migration belum dijalankan ke project Supabase live oleh aplikasi ini.

Migration mengasumsikan struktur lama berikut sudah tersedia: `products_db` dengan kolom `id` dan `title`; `orders` dengan `id`, `product_name`, `buyer_name`, `buyer_phone`, `shipping_address`, dan `status`; `deposits` dengan `user_name`, `waste_type`, `weight`, `nominal`, dan `deposit_date`; serta `gold_batches` dan `sembako_requests` dengan `id`, `user_name`, `amount`, dan `status`. Tipe `orders.product_id` baru disesuaikan otomatis dengan tipe `products_db.id`; jika kolom itu sudah ada, pastikan tipenya cocok. Pastikan juga nama/tipe kolom lain sesuai sebelum menjalankan migration.

### Mengaktifkan akun pengurus pertama

1. Pastikan project Supabase di dashboard sama dengan project yang dipakai aplikasi (`gddiajhvpdvuqiljcasv`). Buat akun melalui **Supabase Dashboard → Authentication → Users → Add user** dengan email dan kata sandi yang akan dipakai untuk login. Pastikan akun dikonfirmasi/aktif; migration tidak membuat kredensial login.
2. Jalankan SQL berikut melalui **SQL Editor** untuk membuat atau mengaktifkan baris akun pengurus. Ini juga menangani akun Auth yang sudah ada sebelum migration dipasang:

```sql
insert into public.bank_accounts (user_id, email, full_name, phone, role, status)
select id, lower(email), 'Nama Pengurus',
       coalesce(raw_user_meta_data ->> 'phone', ''), 'admin', 'active'
from auth.users
where lower(email) = lower('EMAIL_PENGURUS')
on conflict (user_id) do update
set email = excluded.email,
    full_name = excluded.full_name,
    role = 'admin',
    status = 'active';
```

Ganti `EMAIL_PENGURUS` dan `Nama Pengurus` dengan data yang sesuai. Jika query tidak memasukkan atau memperbarui baris, pastikan akun dengan email tersebut ada di **Authentication → Users** pada project yang sama. Login memakai email dan kata sandi akun Auth tersebut. Jika muncul `Invalid login credentials`, periksa project/email dan gunakan reset kata sandi di Supabase Dashboard; perubahan `bank_accounts` tidak dapat memperbaiki kata sandi Auth. Jangan pernah menaruh kata sandi atau service-role key ke dalam source code.

Akun warga mendaftar melalui Portal Warga menggunakan email dan kata sandi, lalu menunggu pengurus memeriksa nama dan menyetujui akun di menu **Akun Warga**. Nama yang sudah dipakai akun warga aktif tidak dapat digunakan oleh akun aktif lain.

### Verifikasi email dan lupa kata sandi

Verifikasi email di Supabase Auth berbeda dari persetujuan akses aplikasi. Email yang sudah diverifikasi masih harus memiliki baris di `bank_accounts` dengan `status = 'active'` dan `role` yang sesuai (`admin` untuk pengurus; `resident` untuk warga). Akun admin yang dibuat sebelum migration perlu diprovisikan melalui SQL admin di atas.

Form login admin maupun warga menyediakan **Lupa kata sandi?**. Tautan reset dikirim oleh Supabase Auth ke email; setelah tautan dibuka, pengguna membuat kata sandi baru di aplikasi. Agar tautan kembali ke aplikasi, atur **Supabase Dashboard → Authentication → URL Configuration**: jadikan URL aplikasi yang benar sebagai **Site URL**, lalu tambahkan origin lokal yang dipakai (misalnya `http://localhost:5175` atau `http://127.0.0.1:5175`) dan origin deployment ke **Redirect URLs**. Port harus cocok dengan alamat yang terlihat di browser. Periksa juga folder spam dan konfigurasi email Auth jika pesan reset/verifikasi tidak masuk.

### Pengaturan operasional awal

Nomor WhatsApp, alamat, jam layanan, ketentuan setoran, dan batas penukaran awal diisi sesuai informasi pengelola. Pengurus dapat memperbaruinya melalui menu **Info Bank Sampah**. Sebelum katalog menerima pesanan, isi nilai harga jual dan jumlah stok setiap produk melalui **Stok Produk**; stok awal migration bernilai nol karena jumlah barang saat ini belum diketahui.

Stok sampah pada rekap merupakan estimasi setoran tercatat dikurangi pengeluaran yang dicatat. Untuk data stok fisik sebelum aplikasi digunakan, lakukan rekonsiliasi terlebih dahulu karena riwayat stok keluar lama tidak tersedia.
