# GROUNDHOOD — Website Development Workflow Prompt

> **Dokumen ini adalah referensi utama (single source of truth) untuk seluruh proses pengembangan website e-commerce thrift store GROUNDHOOD. Setiap halaman, komponen, dan fitur yang dibuat HARUS mengacu pada dokumen ini agar tetap konsisten, terarah, dan tidak keluar dari konsep utama.**

---

## 1. IDENTITAS PROYEK

- **Nama Brand:** GROUNDHOOD
- **Jenis Sistem:** Website E-Commerce Thrift Store (Berbasis Web)
- **Konsep:** Website penjualan produk thrift/secondhand secara online dengan proses pembayaran manual (transfer bank), tanpa payment gateway pihak ketiga, dan tanpa integrasi ekspedisi otomatis.
- **Aktor Utama:** Customer (User) dan Admin
- **Konteks:** Proyek akademik — dokumentasi harus konsisten antara requirements, diagram, dan implementasi.

---

## 2. ARSITEKTUR & TEKNOLOGI

> *(Sesuaikan bagian ini dengan stack teknologi yang kamu pilih)*


---

## 3. STRUKTUR DATABASE (ERD)

Berdasarkan ERD yang sudah dibuat, database terdiri dari tabel-tabel berikut:

### 3.1 Tabel `user`
| Field          | Tipe    | Keterangan           |
|----------------|---------|----------------------|
| id_user        | PK      | Primary key          |
| nama           | string  | Nama lengkap         |
| email          | string  | Email (unique)       |
| password       | string  | Password (terenkripsi) |
| role           | enum    | 'customer' / 'admin' |
| alamat         | text    | Alamat pengiriman    |
| no_handphone   | string  | Nomor HP             |

### 3.2 Tabel `kategori`
| Field          | Tipe    | Keterangan           |
|----------------|---------|----------------------|
| id_kategori    | PK      | Primary key          |
| nama_kategori  | string  | Nama kategori        |

### 3.3 Tabel `produk`
| Field          | Tipe    | Keterangan                |
|----------------|---------|---------------------------|
| id_produk      | PK      | Primary key               |
| nama_produk    | string  | Nama produk               |
| harga          | integer | Harga dalam Rupiah        |
| stok           | integer | Jumlah stok tersedia      |
| deskripsi      | text    | Deskripsi produk          |
| id_kategori    | FK      | Relasi ke tabel kategori  |

### 3.4 Tabel `keranjang`
| Field          | Tipe    | Keterangan              |
|----------------|---------|-------------------------|
| id_keranjang   | PK      | Primary key             |
| id_user        | FK      | Relasi ke tabel user    |

### 3.5 Tabel `detail_keranjang`
| Field          | Tipe    | Keterangan                |
|----------------|---------|---------------------------|
| id_detail      | PK      | Primary key               |
| id_keranjang   | FK      | Relasi ke tabel keranjang |
| id_produk      | FK      | Relasi ke tabel produk    |
| jumlah         | integer | Jumlah item               |

### 3.6 Tabel `pesanan`
| Field            | Tipe      | Keterangan              |
|------------------|-----------|-------------------------|
| id_pesanan       | PK        | Primary key             |
| id_user          | FK        | Relasi ke tabel user    |
| tanggal_pesanan  | datetime  | Tanggal order dibuat    |
| status           | enum      | Status pesanan          |
| total_harga      | integer   | Total harga pesanan     |

**Status pesanan yang valid:**
- `menunggu_pembayaran` — Order dibuat, menunggu customer upload bukti
- `menunggu_konfirmasi` — Bukti sudah diupload, menunggu admin verifikasi
- `diproses` — Pembayaran dikonfirmasi, pesanan sedang disiapkan
- `dikirim` — Pesanan sudah dikirim
- `selesai` — Pesanan diterima customer
- `dibatalkan` — Pesanan dibatalkan

### 3.7 Tabel `detail_pesanan`
| Field              | Tipe    | Keterangan                |
|--------------------|---------|---------------------------|
| id_detail_pesanan  | PK      | Primary key               |
| id_pesanan         | FK      | Relasi ke tabel pesanan   |
| id_produk          | FK      | Relasi ke tabel produk    |
| jumlah             | integer | Jumlah item               |
| harga              | integer | Harga saat pembelian      |

### 3.8 Tabel `pembayaran`
| Field              | Tipe    | Keterangan                   |
|--------------------|---------|------------------------------|
| id_pembayaran      | PK      | Primary key                  |
| id_pesanan         | FK      | Relasi ke tabel pesanan      |
| metode_pembayaran  | string  | Metode (transfer bank)       |
| bukti_pembayaran   | string  | Path file bukti transfer     |
| status_verifikasi  | enum    | 'pending' / 'valid' / 'tidak_valid' |

### Relasi Antar Tabel
```
user (1) ——→ (N) pesanan
user (1) ——→ (1) keranjang
keranjang (1) ——→ (N) detail_keranjang
detail_keranjang (N) ←—— (1) produk
pesanan (1) ——→ (N) detail_pesanan
detail_pesanan (N) ←—— (1) produk
pesanan (1) ——→ (1) pembayaran
kategori (1) ——→ (N) produk
```

---

## 4. DAFTAR HALAMAN & FITUR

### 4.1 Halaman Publik (Tanpa Login)

| No | Halaman               | Deskripsi                                                      |
|----|----------------------|----------------------------------------------------------------|
| 1  | Landing Page / Home  | Menampilkan hero section, produk terbaru/unggulan, kategori    |
| 2  | Katalog Produk       | Daftar semua produk dengan filter kategori dan pencarian       |
| 3  | Detail Produk        | Info lengkap produk: gambar, nama, harga, stok, deskripsi, tombol tambah ke keranjang |
| 4  | Halaman Registrasi   | Form registrasi: nama, email, password, alamat, no HP          |
| 5  | Halaman Login        | Form login: email dan password                                 |

### 4.2 Halaman Customer (Setelah Login)

| No | Halaman                | Deskripsi                                                      |
|----|------------------------|----------------------------------------------------------------|
| 6  | Keranjang Belanja      | Daftar produk di keranjang, ubah jumlah, hapus item, total harga, tombol checkout |
| 7  | Checkout               | Konfirmasi pesanan, isi/edit alamat pengiriman, lihat ringkasan order |
| 8  | Upload Bukti Bayar     | Halaman untuk upload bukti transfer setelah checkout            |
| 9  | Status Pesanan         | Lihat status pesanan aktif dan tracking progress                |
| 10 | Riwayat Transaksi      | Daftar semua pesanan yang pernah dibuat beserta statusnya       |

### 4.3 Halaman Admin (Dashboard)

| No | Halaman                     | Deskripsi                                                    |
|----|-----------------------------|--------------------------------------------------------------|
| 11 | Dashboard Admin             | Overview: jumlah pesanan baru, total produk, ringkasan       |
| 12 | Kelola Produk               | CRUD produk: tambah, edit, hapus, lihat daftar produk        |
| 13 | Kelola Kategori             | CRUD kategori: tambah, edit, hapus kategori                  |
| 14 | Kelola Pesanan              | Lihat semua pesanan, ubah status pesanan                     |
| 15 | Verifikasi Pembayaran       | Lihat bukti transfer, konfirmasi valid/tidak valid           |
| 16 | Kelola User                 | Lihat daftar data pengguna yang terdaftar                    |
| 17 | Laporan Transaksi           | Lihat laporan penjualan/transaksi                            |

---

## 5. ALUR KERJA UTAMA (WORKFLOW)

### 5.1 Alur Registrasi (Sesuai Activity Diagram)

```
[User] Membuka Halaman Registrasi
   ↓
[User] Mengisi Data Registrasi (nama, email, password, alamat, no HP)
   ↓
[Admin/Sistem] Memvalidasi Data Registrasi
   ↓
   ├── [Tidak Valid] → Mengirimkan Notifikasi Data Salah → User mengisi ulang
   └── [Valid] → Mengirimkan Notifikasi Akun Berhasil Dibuat → SELESAI
```

**Validasi yang dilakukan:**
- Email belum terdaftar
- Format email valid
- Password memenuhi kriteria minimum
- Semua field wajib terisi

### 5.2 Alur Login (Sesuai Activity Diagram)

```
[User] Membuka Halaman Login
   ↓
[User] Mengisi Data Login (email, password)
   ↓
[Admin/Sistem] Memvalidasi Data Login
   ↓
   ├── [Tidak Valid] → Mengirimkan Notifikasi Data Salah → User mengisi ulang
   └── [Valid] → Menampilkan Halaman Utama → SELESAI
```

**Catatan:**
- Jika role = admin → redirect ke Dashboard Admin
- Jika role = customer → redirect ke Halaman Utama (Home)

### 5.3 Alur Pembelian Produk (Flow Utama Website — To Be)

```
[Customer] Membuka Katalog Produk
   ↓
[Customer] Mencari / Memfilter Produk (opsional)
   ↓
[Customer] Memilih Produk → Melihat Detail Produk
   ↓
[Customer] Menambahkan Produk ke Keranjang
   ↓
[Customer] Membuka Halaman Keranjang
   ↓
[Customer] Mengatur Jumlah / Menghapus Item (opsional)
   ↓
[Customer] Klik Checkout
   ↓
[Sistem] Menampilkan Ringkasan Pesanan + Form Alamat Pengiriman
   ↓
[Customer] Mengisi/Konfirmasi Alamat → Konfirmasi Pesanan
   ↓
[Sistem] Membuat Pesanan (status: menunggu_pembayaran)
[Sistem] Mengurangi Stok Produk
[Sistem] Mengosongkan Keranjang
[Sistem] Generate Nomor Order
   ↓
[Sistem] Menampilkan Info Pembayaran (nomor rekening, total, batas waktu)
   ↓
[Customer] Melakukan Transfer Manual (di luar sistem)
   ↓
[Customer] Upload Bukti Transfer
   ↓
[Sistem] Mengubah Status Pesanan → menunggu_konfirmasi
   ↓
[Admin] Melihat Bukti Transfer → Memvalidasi
   ↓
   ├── [Tidak Valid] → Status kembali ke menunggu_pembayaran
   │                   → Notifikasi ke customer untuk upload ulang
   └── [Valid] → Status berubah ke diproses
                → Admin menyiapkan dan mengirim produk
                → Status berubah ke dikirim
                → Status berubah ke selesai (setelah diterima)
```

### 5.4 Alur Admin — Kelola Produk

```
[Admin] Login → Dashboard Admin
   ↓
[Admin] Navigasi ke Kelola Produk
   ↓
   ├── Tambah Produk: Isi form (nama, harga, stok, deskripsi, kategori, gambar) → Simpan
   ├── Edit Produk: Pilih produk → Ubah data → Simpan
   └── Hapus Produk: Pilih produk → Konfirmasi → Hapus
```

### 5.5 Alur Admin — Verifikasi Pembayaran

```
[Admin] Navigasi ke Verifikasi Pembayaran
   ↓
[Admin] Melihat Daftar Pembayaran Pending
   ↓
[Admin] Klik salah satu → Melihat Bukti Transfer
   ↓
   ├── [Valid] → Konfirmasi → Status pesanan berubah ke 'diproses'
   └── [Tidak Valid] → Tolak → Status kembali ke 'menunggu_pembayaran'
```

### 5.6 Alur Admin — Kelola Pesanan

```
[Admin] Navigasi ke Kelola Pesanan
   ↓
[Admin] Melihat Daftar Semua Pesanan (dengan filter status)
   ↓
[Admin] Pilih Pesanan → Lihat Detail
   ↓
[Admin] Ubah Status: diproses → dikirim → selesai
```

---

## 6. KEBUTUHAN FUNGSIONAL (FR)

### 6.1 Customer

| Kode  | Kebutuhan                                      |
|-------|-------------------------------------------------|
| FR-01 | Sistem menyediakan fitur registrasi pengguna    |
| FR-02 | Sistem menyediakan fitur login dan logout       |
| FR-03 | User dapat melihat katalog produk               |
| FR-04 | User dapat mencari produk                       |
| FR-05 | User dapat memfilter produk berdasarkan kategori|
| FR-06 | User dapat melihat detail produk                |
| FR-07 | User dapat menambahkan produk ke keranjang      |
| FR-08 | User dapat mengubah jumlah produk di keranjang  |
| FR-09 | User dapat menghapus produk dari keranjang      |
| FR-10 | User dapat melakukan checkout                   |
| FR-11 | User dapat mengisi alamat pengiriman            |
| FR-12 | Sistem menghasilkan nomor order                 |
| FR-13 | User dapat mengunggah bukti pembayaran          |
| FR-14 | User dapat melihat status pesanan               |
| FR-15 | User dapat melihat riwayat transaksi            |

### 6.2 Admin

| Kode  | Kebutuhan                                       |
|-------|--------------------------------------------------|
| FR-16 | Admin dapat login ke sistem                      |
| FR-17 | Admin dapat menambahkan produk                   |
| FR-18 | Admin dapat mengubah produk                      |
| FR-19 | Admin dapat menghapus produk                     |
| FR-20 | Admin dapat mengelola kategori                   |
| FR-21 | Admin dapat melihat data pengguna                |
| FR-22 | Admin dapat melihat pesanan                      |
| FR-23 | Admin dapat mengonfirmasi pembayaran             |
| FR-24 | Admin dapat mengubah status pesanan              |
| FR-25 | Admin dapat melihat laporan transaksi            |

---

## 7. KEBUTUHAN NON-FUNGSIONAL

| Aspek         | Requirement                                                      |
|---------------|------------------------------------------------------------------|
| Usability     | Tampilan sederhana, navigasi mudah dipahami                      |
| Performance   | Waktu respon cepat saat menampilkan data                         |
| Security      | Password terenkripsi, validasi input, autentikasi admin          |
| Compatibility | Responsive — bisa diakses dari desktop dan mobile                |

---

## 8. ATURAN KONSISTENSI DESAIN UI

> **Bagian ini WAJIB diikuti saat membuat halaman baru agar seluruh website memiliki tampilan dan pengalaman yang seragam.**

### 8.1 Prinsip Utama

1. **Template-First Approach:** Jika sudah ada template/desain untuk halaman tertentu, semua halaman lain HARUS mengikuti pola visual yang sama (layout, spacing, font, warna, komponen).
2. **Komponen Reusable:** Buat komponen UI yang bisa dipakai ulang (navbar, footer, card produk, tombol, form input, modal, badge status, dll).
3. **Konsistensi Navigasi:** Struktur navbar dan footer harus sama di semua halaman. Navbar menyesuaikan role (customer/admin).

### 8.2 Panduan Visual

| Elemen              | Aturan                                                            |
|---------------------|-------------------------------------------------------------------|
| **Layout**          | Ikuti grid/layout dari template yang sudah ada                    |
| **Typography**      | Font family, size, dan weight konsisten di semua halaman          |
| **Color Palette**   | Gunakan warna brand GROUNDHOOD secara konsisten                   |
| **Spacing**         | Padding dan margin mengikuti pola template (8px, 16px, 24px, 32px) |
| **Border Radius**   | Konsisten di semua card, tombol, dan input                        |
| **Button Style**    | Primary, secondary, dan danger button harus seragam               |
| **Form Style**      | Semua input field, label, dan validasi error mengikuti pola yang sama |
| **Card Style**      | Card produk, card pesanan, card info — semua mengikuti pola yang sama |
| **Responsive**      | Semua halaman harus responsive (mobile-first atau desktop-first sesuai template) |

### 8.3 Komponen Wajib di Setiap Halaman

- **Navbar:** Logo, navigasi utama, ikon keranjang (customer), menu user/logout
- **Footer:** Info brand, kontak, link penting
- **Breadcrumb:** (opsional) untuk navigasi sub-halaman
- **Loading State:** Skeleton/spinner saat data sedang dimuat
- **Empty State:** Pesan yang jelas saat data kosong (keranjang kosong, belum ada pesanan, dll)
- **Error State:** Tampilan error yang user-friendly

### 8.4 Instruksi untuk AI / Developer

Saat membuat halaman baru, selalu ikuti langkah ini:

1. **Lihat template yang sudah ada** — jangan buat desain baru dari nol
2. **Gunakan komponen yang sudah dibuat** — jangan duplicate styling
3. **Ikuti naming convention** yang sudah ada (class names, file structure)
4. **Pastikan responsive** — test di mobile dan desktop
5. **Validasi input** di frontend dan backend
6. **Tampilkan feedback** — success message, error message, loading state

---

## 9. BATASAN SISTEM

| Batasan                           | Penjelasan                                                  |
|-----------------------------------|-------------------------------------------------------------|
| Tidak ada Payment Gateway         | Pembayaran hanya via transfer manual                        |
| Tidak ada Integrasi Ekspedisi     | Pengiriman diatur manual oleh admin, bukan via API JNE/dll  |
| Tidak ada Fitur Ulasan            | Tidak ada review/rating produk                              |
| Tidak ada Wishlist                | Tidak ada fitur simpan produk favorit                       |
| Tidak ada Recommendation Engine   | Tidak ada rekomendasi produk otomatis                       |
| Tidak ada Chat/Messaging          | Tidak ada fitur chat antara customer dan admin               |
| Sistem Admin Tunggal              | Hanya satu level admin, tidak ada super admin               |

---

## 10. MAPPING: REQUIREMENT ↔ HALAMAN ↔ DATABASE

| FR     | Halaman Terkait           | Tabel Database Terlibat                |
|--------|---------------------------|----------------------------------------|
| FR-01  | Registrasi                | user                                   |
| FR-02  | Login                     | user                                   |
| FR-03  | Katalog Produk            | produk, kategori                       |
| FR-04  | Katalog Produk            | produk                                 |
| FR-05  | Katalog Produk            | produk, kategori                       |
| FR-06  | Detail Produk             | produk, kategori                       |
| FR-07  | Detail Produk / Katalog   | keranjang, detail_keranjang, produk    |
| FR-08  | Keranjang                 | detail_keranjang                       |
| FR-09  | Keranjang                 | detail_keranjang                       |
| FR-10  | Checkout                  | pesanan, detail_pesanan, produk        |
| FR-11  | Checkout                  | pesanan, user                          |
| FR-12  | Checkout (auto-generate)  | pesanan                                |
| FR-13  | Upload Bukti Bayar        | pembayaran                             |
| FR-14  | Status Pesanan            | pesanan, pembayaran                    |
| FR-15  | Riwayat Transaksi         | pesanan, detail_pesanan, pembayaran    |
| FR-16  | Login (Admin)             | user                                   |
| FR-17  | Kelola Produk             | produk, kategori                       |
| FR-18  | Kelola Produk             | produk                                 |
| FR-19  | Kelola Produk             | produk                                 |
| FR-20  | Kelola Kategori           | kategori                               |
| FR-21  | Kelola User               | user                                   |
| FR-22  | Kelola Pesanan            | pesanan, detail_pesanan                |
| FR-23  | Verifikasi Pembayaran     | pembayaran, pesanan                    |
| FR-24  | Kelola Pesanan            | pesanan                                |
| FR-25  | Laporan Transaksi         | pesanan, detail_pesanan, pembayaran    |

---

## 11. CHECKLIST PENGEMBANGAN

Gunakan checklist ini untuk tracking progress:

### Authentication
- [ ] Halaman Registrasi (FR-01)
- [ ] Halaman Login (FR-02)
- [ ] Logout functionality (FR-02)
- [ ] Role-based redirect (customer → home, admin → dashboard)

### Customer — Produk
- [ ] Halaman Katalog Produk (FR-03, FR-04, FR-05)
- [ ] Halaman Detail Produk (FR-06)
- [ ] Fitur Pencarian (FR-04)
- [ ] Filter Kategori (FR-05)

### Customer — Keranjang & Checkout
- [ ] Halaman Keranjang (FR-07, FR-08, FR-09)
- [ ] Tambah ke Keranjang (FR-07)
- [ ] Ubah Jumlah di Keranjang (FR-08)
- [ ] Hapus dari Keranjang (FR-09)
- [ ] Halaman Checkout (FR-10, FR-11, FR-12)
- [ ] Generate Nomor Order (FR-12)

### Customer — Pembayaran & Pesanan
- [ ] Halaman Upload Bukti Transfer (FR-13)
- [ ] Halaman Status Pesanan (FR-14)
- [ ] Halaman Riwayat Transaksi (FR-15)

### Admin
- [ ] Dashboard Admin
- [ ] Kelola Produk — CRUD (FR-17, FR-18, FR-19)
- [ ] Kelola Kategori — CRUD (FR-20)
- [ ] Kelola Pesanan — Lihat & Ubah Status (FR-22, FR-24)
- [ ] Verifikasi Pembayaran (FR-23)
- [ ] Kelola User — Lihat Data (FR-21)
- [ ] Laporan Transaksi (FR-25)

### Non-Fungsional
- [ ] Responsive Design (mobile + desktop)
- [ ] Password Encryption
- [ ] Input Validation (frontend + backend)
- [ ] Authentication Middleware (protect routes)
- [ ] Konsistensi UI dengan template yang sudah ada

---

## 12. CATATAN PENTING

1. **Setiap kali membuat halaman atau fitur baru, SELALU cek dokumen ini** untuk memastikan fitur sesuai dengan FR, ERD, dan workflow yang sudah ditentukan.
2. **Jangan menambahkan fitur di luar scope** yang sudah didefinisikan di bagian 6 (FR) dan bagian 9 (Batasan Sistem) tanpa revisi dokumen ini terlebih dahulu.
3. **Konsistensi desain adalah prioritas** — gunakan template yang sudah ada sebagai acuan untuk semua halaman baru.
4. **Dokumen ini bersifat living document** — jika ada perubahan keputusan, update dokumen ini terlebih dahulu sebelum implementasi.
