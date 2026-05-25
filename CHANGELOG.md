# Riwayat Lengkap Perubahan & Pengembangan Proyek (Changelog)
Dokumen ini mencantumkan seluruh riwayat perubahan, penambahan fitur, pemecahan masalah (debugging), peningkatan estetika visual, serta penyempurnaan navigasi pada website **WBZ Creative Studio** sejak awal sesi pengerjaan di chatroom ini.

---

## 🔍 Tahap Awal: Pemetaan Arsitektur & Kesiapan Backend
Sebelum memulai pengembangan fitur, kami melakukan analisis struktur backend untuk memastikan kesiapan sistem:
* **Framework Backend:** Laravel 10 (PHP) terintegrasi dengan React SPA (Single Page Application) menggunakan Vite.
* **Sistem Auth Admin:** Menggunakan Laravel Sanctum token-based authentication (`AdminAuthController.php`) yang melayani endpoint:
  * `POST /api/admin/login`
  * `POST /api/admin/logout`
  * `GET /api/admin/me`
  * `POST /api/admin/change-password`
* **Manajemen Konten:** Menggunakan `ContentController.php` untuk membaca dan menyimpan konten per seksi (hero, about, services, works) dalam format file `.json` di dalam `storage/app/content/`.
  * `GET /content/{section}` (Public)
  * `PUT /admin/content/{section}` (Protected Admin)
  * `POST /admin/upload` (Upload asset gambar)
* **Routing Laravel:** Catch-all route di `routes/web.php` mengarahkan semua URL non-API ke view React SPA (`welcome.blade.php`).

---

## 🚀 Rincian Fitur & Solusi yang Diimplementasikan (Kronologis)

### 1. 🔗 Integrasi Halaman Detail Portofolio (Membuat Card Bisa Diklik)
**Permintaan:** Saat kartu karya (*work card*) di landing page diklik, halaman harus berpindah ke halaman detail yang sesuai (bukan sekadar tampilan visual statis).
* **Pembuatan Halaman Baru:** 
  * Membuat file halaman detail khusus di [WorkDetail.jsx](file:///c:/laragon/www/WBZ/resources/js/pages/WorkDetail.jsx).
  * Membuat file stylesheet baru di [work-detail.css](file:///c:/laragon/www/WBZ/resources/js/styles/work-detail.css) untuk mengatur visual halaman detail.
* **Routing SPA:** Menambahkan rute dinamis `/works/:id` di dalam komponen router [app.jsx](file:///c:/laragon/www/WBZ/resources/js/app.jsx).
* **Konversi Elemen HTML:** Mengubah elemen pembungkus artikel kartu karya di [Works.jsx](file:///c:/laragon/www/WBZ/resources/js/components/Works.jsx) menjadi komponen `<Link>` dinamis React Router agar mengarah ke `/works/${work.id || idx + 1}`.

---

### 2. 🛠️ Penanganan Masalah: Auto-Refresh Tanpa Henti (Infinite Reload Loop)
**Kendala:** Browser terus menerus memuat ulang (*refresh*) halaman secara otomatis ketika halaman diakses di Laragon lokal.
* **Penyebab:** Konflik koneksi HMR (Hot Module Replacement) dari Vite Dev Server yang masih berjalan di latar belakang (background) bersamaan dengan konfigurasi `refresh: true` di file Vite Laravel serta penulisan tag `@viteReactRefresh` pada file Blade.
* **Perbaikan:**
  * Menembak mati task background Vite Dev Server yang menggantung.
  * Menonaktifkan pemantauan reload otomatis dengan menyetel `refresh: false` pada [vite.config.js](file:///c:/laragon/www/WBZ/vite.config.js).
  * Menghapus direktif `@viteReactRefresh` dari file template [welcome.blade.php](file:///c:/laragon/www/WBZ/resources/views/welcome.blade.php).
  * Melakukan build ulang bundle statis menggunakan perintah `npm run build`.

---

### 3. 🛠️ Penanganan Masalah: Tampilan Blank / Halaman Menampilkan "Project Not Found"
**Kendala:** Setelah kartu diklik, tampilan halaman menjadi putih kosong (*blank*) atau menampilkan teks "Project Not Found" padahal data proyek sudah tersimpan di database/JSON.
* **Penyebab:** 
  1. Terjadi inkonsistensi URL pemanggilan API Axios. Landing page memanggil `/content/works` (tanpa prefix `/api`), sedangkan halaman detail memanggil `/api/content/works` yang menyebabkan request diblokir atau salah rute.
  2. Data ID portofolio yang digenerate oleh Admin Panel bertipe timestamp angka besar, sedangkan pencarian ID di halaman detail menggunakan string murni sehingga perbandingan tipe data di JavaScript tidak cocok.
* **Perbaikan:**
  * Menstandardisasi pemanggilan API di [WorkDetail.jsx](file:///c:/laragon/www/WBZ/resources/js/pages/WorkDetail.jsx) agar secara aman mengambil data dari rute beranda `/content/works`.
  * Memperbaiki komparasi pencarian ID dengan memaksa perbandingan bertipe string: `items.find(w => String(w.id) === String(id))`.
  * Memperbaiki logika penanganan loading agar tidak crash jika request API mengalami delay.

---

### 4. 🖼️ Fitur Utama: Sistem Tiga Gambar Portofolio (Three-Image System)
**Permintaan:** Foto yang dipajang di kartu landing page harus bisa berbeda dengan foto yang muncul di halaman detail (header atas & gambar deskripsi bawah).
* **Perubahan Form Admin:** Memperbarui form modal di [WorksEditor.jsx](file:///c:/laragon/www/WBZ/resources/js/components/admin/WorksEditor.jsx) agar memiliki 3 kolom upload gambar tersendiri:
  * **Thumbnail (Landing Card):** Gambar utama kartu galeri depan (`image`).
  * **Hero Banner (Detail Top):** Latar belakang penuh di bagian atas halaman detail (`heroImage`).
  * **Content Image (Detail About):** Gambar showcase khusus yang diletakkan di dalam cerita deskripsi proyek (`detailImage`).
* **Sistem Fallback:** Menambahkan proteksi logika di dalam [WorkDetail.jsx](file:///c:/laragon/www/WBZ/resources/js/pages/WorkDetail.jsx):
  * Latar belakang Hero atas menggunakan rute: `work.heroImage || work.image`.
  * Gambar konten bawah menggunakan rute: `work.detailImage || work.image`.
  * Logika ini memastikan proyek lama yang hanya memiliki 1 gambar tidak akan rusak atau menampilkan gambar kosong.

---

### 5. 🧹 Pembersihan Estetika & Refinement Visual (Minimalist & Premium)
**Permintaan:** Menyembunyikan tulisan kategori & tag di kartu depan, serta menghapus metadata sidebar di halaman detail agar tampak bersih, luas, dan premium.
* **Penyederhanaan Galeri Depan:** Menghapus teks kategori (`work.category`) dan kompilasi tag (`work.tags`) dari overlay hover kartu portofolio di [Works.jsx](file:///c:/laragon/www/WBZ/resources/js/components/Works.jsx). Galeri kini hanya menampilkan judul proyek uppercase dan panah interaktif yang modern.
* **Penghapusan Sidebar Detail:** Menghapus komponen `.wd-meta` (yang menampilkan detail Client, Year, Category, dan Tags) dari sebelah kanan halaman detail [WorkDetail.jsx](file:///c:/laragon/www/WBZ/resources/js/pages/WorkDetail.jsx).
* **Layout Terpusat (Centered Modern Layout):**
  * Mengubah struktur HTML di halaman detail dari skema grid 2-kolom menjadi layout 1-kolom terpusat menggunakan kelas kontainer baru `.wd-content__container`.
  * Menulis ulang aturan CSS di [work-detail.css](file:///c:/laragon/www/WBZ/resources/js/styles/work-detail.css) dengan lebar maksimal ideal `880px`, auto-centering (`margin: 0 auto`), dan padding responsif untuk menonjolkan keindahan tipografi cerita serta gambar detail.

---

### 6. ⚓ Perbaikan Navigasi: Menu Navbar Berfungsi di Halaman Detail (Smart Routing SPA)
**Kendala:** Saat user berada di halaman detail (`/works/:id`), tombol navigasi di navbar (About, Services, Works, Contact) tidak berfungsi sama sekali.
* **Penyebab:** Navbar menggunakan pemanggilan DOM smooth scroll instan (`document.querySelector(hash)`) ke seksi-seksi beranda. Ketika user berada di halaman detail, elemen seksi-seksi tersebut tidak ada di halaman, sehingga menu navigasi macet total.
* **Perbaikan Cerdas (Smart Redirection):**
  * Memperbarui [Navbar.jsx](file:///c:/laragon/www/WBZ/resources/js/components/Navbar.jsx) dengan menggunakan hook `useLocation` dan `useNavigate` dari React Router.
  * **Logika Kerja Baru:**
    * Jika user berada di beranda (`/`), mengklik menu navbar akan langsung memicu smooth scroll lokal secara instan.
    * Jika user berada di halaman detail (`/works/:id`), mengklik menu navbar akan langsung mengarahkan user kembali ke homepage beranda (ditambahkan parameter hash target, contoh: `/#services`), kemudian saat komponen homepage dimuat ulang, navbar akan mendeteksi hash tersebut dan otomatis memicu smooth scroll halus ke seksi target tanpa me-reload halaman web secara keras (berbasis Pure SPA).
  * Mengubah tautan logo navbar agar menggunakan `<Link to="/">` React Router demi menjamin kemudahan akses kembali ke beranda.

---

## 📂 Daftar File yang Dimodifikasi secara Lengkap

1.  **[Navbar.jsx](file:///c:/laragon/www/WBZ/resources/js/components/Navbar.jsx)**
    *   Mengintegrasikan rute cerdas lintas halaman menggunakan `useLocation` & `useNavigate`.
    *   Menambahkan auto-scroll hook ketika mendeteksi parameter hash beranda.
    *   Mengubah tag logo dari anchor biasa `href="#"` menjadi `<Link to="/">`.
2.  **[WorksEditor.jsx](file:///c:/laragon/www/WBZ/resources/js/components/admin/WorksEditor.jsx)**
    *   Memperluas state form modal portofolio agar menyimpan field `heroImage` dan `detailImage`.
    *   Menyediakan 3 input upload gambar tersendiri ("Thumbnail", "Hero Banner", "Content Image") lengkap dengan tombol status upload dinamis.
3.  **[WorkDetail.jsx](file:///c:/laragon/www/WBZ/resources/js/pages/WorkDetail.jsx)**
    *   Menerapkan dynamic source untuk banner atas (`heroImage`) dan gambar konten bawah (`detailImage`) dengan sistem fallback.
    *   Menghilangkan seksi sidebar metadata kanan `.wd-meta`.
    *   Menyelaraskan struktur pembungkus kontainer menjadi satu kolom terpusat.
4.  **[work-detail.css](file:///c:/laragon/www/WBZ/resources/js/styles/work-detail.css)**
    *   Menghapus grid 2-kolom bawaan dan memoles layout `.wd-content__container` terpusat selebar `880px` agar tampak simetris, responsif, dan premium.
5.  **[Works.jsx](file:///c:/laragon/www/WBZ/resources/js/components/Works.jsx)**
    *   Menyederhanakan tampilan hover galeri depan dengan membuang data teks kategori & tag, menyisakan estetika judul yang bersih.
6.  **[vite.config.js](file:///c:/laragon/www/WBZ/vite.config.js)**
    *   Menonaktifkan auto-reload loop dengan menyetel `refresh: false`.
7.  **[welcome.blade.php](file:///c:/laragon/www/WBZ/resources/views/welcome.blade.php)**
    *   Menghapus direktif `@viteReactRefresh` untuk memutus loop reconnect HMR saat dijalankan di server Laragon.

---

## 🛠️ Prosedur Pengujian Menyeluruh
Untuk memverifikasi kebenaran dan integrasi sistem ini:
1.  **Akses Halaman Admin:** Buka `http://127.0.0.1:8000/admin` → Masuk ke menu **Works/Portfolio**.
2.  **Edit Entri Portofolio:** Klik **Edit** pada salah satu karya (contoh: *DRIFT AND BASS*).
3.  **Uji Multi-Upload:** Unggah 3 gambar terpisah pada kolom masing-masing dan simpan dengan menekan **Update Work**.
4.  **Verifikasi Landing Page:** Buka halaman depan `http://127.0.0.1:8000/`. Pastikan kartu karya tersebut menampilkan gambar **Thumbnail** dan saat di-hover, tulisan kategori/tag di bawahnya sudah hilang (tampilan super bersih).
5.  **Verifikasi Halaman Detail:** Klik kartu tersebut. Konfirmasi bahwa background header menampilkan **Hero Banner**, gambar bagian deskripsi menampilkan **Content Image**, dan sidebar metadata di kanan sudah hilang (desain centered minimalis).
6.  **Verifikasi Navigasi Global:** Pada halaman detail, klik salah satu menu di navbar (misal: *Services*). Pastikan Anda secara instan diarahkan kembali ke homepage utama, lalu browser secara otomatis bergeser halus (*smooth scroll*) ke seksi Services tanpa me-reload halaman!
