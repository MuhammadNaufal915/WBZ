# Catatan Pengembangan & Penjelasan Fitur (WBZ Landing Page)

Berikut adalah catatan lengkap mengenai semua perubahan, file yang ditambahkan, dan konfigurasi yang dilakukan untuk membangun landing page WBZ Creative Studio. Semua ini dibangun dengan stack **Laravel + React + Vite**.

---

## 1. Konfigurasi & Dependensi (Setup)

### `package.json`
- **Yang dilakukan:** Menambahkan dependensi frontend modern.
- **Library yang ditambahkan:**
  - `react` & `react-dom`: Inti dari framework React untuk membangun UI berbasis komponen.
  - `@vitejs/plugin-react`: Plugin agar Vite (build tool bawaan Laravel) bisa mengompilasi kode React (`.jsx`).
  - `gsap` & `@gsap/react`: GreenSock Animation Platform, standar industri untuk membuat animasi yang sangat mulus (seperti efek teks muncul dan elemen yang bergerak saat di-scroll).
  - `lenis`: Library khusus untuk membajak scroll bawaan browser dan menggantinya dengan *smooth scroll* (seperti efek melayang saat scroll ke bawah/atas).
  - `lucide-react`: Kumpulan ikon SVG modern dan ringan (dipakai untuk ikon panah, ikon servis, dsb).

### `vite.config.js`
- **Yang dilakukan:** Mengatur ulang konfigurasi *bundler* Vite.
- **Tujuan:** Agar Vite tahu bahwa entry point aplikasi kita sekarang adalah `resources/js/app.jsx` (bukan sekadar `app.js` biasa), dan menambahkan plugin `react()` agar sintaks JSX bisa dibaca.

### `.env`
- **Yang dilakukan:** Memperbaiki `APP_URL`.
- **Tujuan:** Memastikan Laravel mengarahkan URL aset statis (seperti file CSS dan JS hasil build) ke path yang benar di folder `public` saat dijalankan menggunakan Laragon.

---

## 2. Penghubung Laravel & React

### `resources/views/welcome.blade.php`
- **Yang dilakukan:** Mengubah tampilan default Laravel menjadi HTML kosong (Shell).
- **Tujuan:** React bekerja sebagai *Single Page Application* (SPA). Laravel hanya bertugas mengirimkan satu file HTML kosong yang berisi `<div id="app"></div>`. Setelah HTML ini dimuat, React akan mengambil alih dan menggambar seluruh antarmuka web ke dalam div tersebut. Di sini juga ditambahkan `@viteReactRefresh` dan `@vite(['resources/js/app.jsx'])` untuk memuat hasil kompilasi React.

### `resources/js/app.jsx` (Entry Point)
- **Yang dilakukan:** Membuat file gerbang masuk (entry) untuk React.
- **Tujuan:** Menggunakan `createRoot` dari React 18/19 untuk mencari `<div id="app">` di dalam Blade, lalu merender (memuat) komponen `<MainApp />` ke dalamnya.

---

## 3. Komponen Utama React (`resources/js/MainApp.jsx`)
- **Yang dilakukan:** Membuat struktur root halaman.
- **Tujuan:** Komponen ini menyatukan semua bagian website (Navbar, Hero, About, dll). Di dalam file ini juga library **Lenis** diinisialisasi menggunakan `useEffect`, sehingga *smooth scroll* langsung aktif di seluruh halaman sejak website pertama kali dibuka.

---

## 4. Bagian-Bagian Halaman (Komponen UI)
Semua file ini berada di `resources/js/components/`:

1. **`Navbar.jsx`**
   - **Tujuan:** Menu navigasi di atas.
   - **Fitur Khusus:** Memiliki state yang mendeteksi posisi scroll. Jika di-scroll ke bawah, background navbar berubah menjadi *blur/glassmorphism* agar teks di bawahnya tidak bertabrakan dengan menu. Ada juga hamburger menu untuk versi HP.

2. **`Hero.jsx`**
   - **Tujuan:** Kesan pertama saat website dibuka (Landing area).
   - **Fitur Khusus:** Menggunakan GSAP Timeline untuk menganimasikan teks "Where Ideas Become Identity" agar muncul kata per kata dari bawah. Dilengkapi logo WBZ transparan berukuran besar di latar belakang (watermark).

3. **`Marquee.jsx`**
   - **Tujuan:** Pita teks berjalan (*ticker*).
   - **Fitur Khusus:** Menampilkan daftar layanan (Branding, Web Design, dll) yang terus bergerak menggunakan animasi CSS murni (*infinite scroll*). Jika kursor diarahkan (hover), gerakan akan berhenti.

4. **`About.jsx`**
   - **Tujuan:** Penjelasan singkat tentang WBZ dan statistik.
   - **Fitur Khusus:** Terintegrasi dengan `ScrollTrigger` dari GSAP. Animasi angka statistik (50+, 30+) tidak akan berjalan sampai elemen tersebut terlihat di layar pengguna saat di-scroll.

5. **`Services.jsx`**
   - **Tujuan:** Menampilkan daftar layanan dalam bentuk kartu (Grid).
   - **Fitur Khusus:** Efek *hover* mewah. Saat mouse diarahkan ke kartu, ikon layanan akan menyala orange, dan sebuah garis vertikal orange akan merambat naik di sisi kiri kartu.

6. **`Works.jsx`**
   - **Tujuan:** Galeri / Portfolio.
   - **Fitur Khusus:** Desain bergaya *Masonry* (kotak-kotak dengan ukuran berbeda, seperti Pinterest). Saat gambar di-hover, nama proyek akan muncul perlahan dari bawah dengan gradient gelap agar teks mudah dibaca.

7. **`CTA.jsx` (Call to Action)**
   - **Tujuan:** Mengajak klien menghubungi WBZ dan mengumpulkan umpan balik (*feedback*).
   - **Fitur Khusus:** Desain teks "Let's Work Together" yang sangat besar dan tombol aksi. Di sini juga ditambahkan **Sistem Rating & Testimonial Interaktif**. Pengunjung bisa memunculkan form pop-up untuk memberi rating (1-5 bintang) beserta ulasannya. Ulasan yang sudah dikirim akan langsung divisualisasikan dalam bentuk animasi *Marquee* (kartu berjalan) di bagian atas tombol aksi.

8. **`Footer.jsx`**
   - **Tujuan:** Bagian terbawah website.
   - **Fitur Khusus:** Berisi link navigasi, link sosial media, dan tombol "Back to top" untuk kembali ke atas halaman dengan mulus. *(Catatan: Sempat ada penyesuaian ikon untuk memastikan kompabilitas saat build).*

---

## 5. Sistem Desain & Styling (CSS)
Semua file CSS berada di `resources/js/styles/`:

- **`globals.css`**
  - **Tujuan:** File ini adalah nyawa desain web. Berisi variabel CSS (Design Tokens) untuk menyimpan kode warna hex (Hitam `#080808`, Orange WBZ `#FF5500`), jenis font (Bebas Neue & Inter), margin otomatis, custom scrollbar, efek seleksi teks, serta reset CSS agar tampilan konsisten di semua browser.
- **File CSS lainnya (`navbar.css`, `hero.css`, dll)**
  - **Tujuan:** Styling dipisah-pisah per komponen agar kode tetap rapi (*modular*), tidak berantakan di satu file, dan mudah jika nanti ingin mengubah desain satu bagian spesifik tanpa merusak bagian lain.

---

## Kesimpulan Proses Debugging Terakhir
Sistem operasi Windows tidak membedakan huruf besar dan kecil pada nama file (case-insensitive). Sebelumnya file `app.jsx` (entry) tertimpa oleh `App.jsx` (komponen root), sehingga React gagal terhubung ke HTML. Masalah ini sudah saya atasi dengan mengubah nama komponen root menjadi `MainApp.jsx` sehingga file konektor `app.jsx` aman bekerja.

---

## 6. Admin Panel & Content Management System (CMS)

### Konsep Utama
Untuk memenuhi kebutuhan *update* konten tanpa perlu mengubah kodingan, telah ditambahkan sistem **Admin Panel** terpisah yang terintegrasi di dalam React SPA menggunakan **React Router**. Laravel bertugas sebagai penyedia API (menyimpan JSON ke folder `storage`) dan autentikasi (Sanctum), sementara React Router menangani navigasi dan UI *dashboard* CMS.

### Backend & API
- **Autentikasi:** Menggunakan **Laravel Sanctum**. Token API disimpan di `localStorage` dan disisipkan ke *header* Axios secara otomatis melalui `AuthContext.jsx`.
- **Database:** Tabel `admins` ditambahkan melalui *migration* baru. Seeder `AdminSeeder` telah dibuat dengan akun bawaan (`admin@wbz.id` / `wbz@admin2024`).
- **Penyimpanan Data Konten:** Konten halaman depan tidak disimpan di database SQL, melainkan disimpan dalam bentuk file **JSON** di folder `storage/app/content/` (misalnya `hero.json`, `about.json`). Hal ini membuat sistem lebih ringan dan sangat mudah di-_backup_.
- **Upload Gambar:** Admin dapat mengunggah gambar untuk *Portfolio Works* yang akan disimpan di direktori `public/uploads/works/`.

### Struktur Komponen Frontend (Admin)
1. **`app.jsx` & React Router:** Aplikasi utama dibungkus dengan `BrowserRouter`. Rute `/` mengarah ke *Landing Page*, `/admin/login` ke halaman login, dan `/admin/*` ke *Dashboard* Admin (dilindungi *auth guard*).
2. **`AdminLogin.jsx`:** Halaman login dengan tampilan desain premium *dark mode*, efek melayang *glassmorphism*, dan animasi ketika *error* atau memuat data.
3. **`AdminDashboard.jsx`:** Layout utama Admin Panel yang terdiri dari *Sidebar*, *Header*, dan *Content Area*.
4. **Modul Editor Konten (`components/admin/`):**
   - **`HeroEditor.jsx`:** Mengubah *headline*, *subtitle*, dan label tombol aksi pada banner awal.
   - **`AboutEditor.jsx`:** Mengubah deskripsi profil agensi dan mengatur daftar statistik dinamis (misal jumlah klien/proyek).
   - **`ServicesEditor.jsx`:** Menambah, mengedit, atau menghapus layanan/jasa. Dilengkapi dengan antarmuka modal (pop-up) untuk memilih ikon SVG.
   - **`WorksEditor.jsx`:** Mengatur galeri portofolio, mendukung fungsi *upload* gambar baru secara *drag-and-drop/click*, dan mengelola tag kategori proyek.
   - **`RatingsManager.jsx`:** Antarmuka khusus bagi admin untuk melihat, memoderasi, dan menghapus ulasan (*rating/review*) yang dikirimkan oleh pengunjung melalui form di bagian CTA. Modul ini adalah satu-satunya fitur yang terhubung langsung ke Database SQL murni (Tabel `ratings`).
   - **`SettingsPanel.jsx`:** Fitur bagi admin untuk mengubah *password* keamanan mereka.
5. **Dinamisasi Komponen UI Landing Page:** File komponen *landing page* (`Hero.jsx`, `About.jsx`, `Services.jsx`, `Works.jsx`) yang sebelumnya berisi *hardcoded* teks (statis), kini telah direvisi menggunakan `useEffect` + Axios untuk memanggil *endpoint* API (`/api/content/...`). Sehingga, setiap ada perubahan pada Admin Panel, *Landing Page* otomatis berubah.

---

## 7. Pembaruan Lanjutan & Perbaikan Bug Terakhir

### Perbaikan Tampilan Blank (Layar Hitam)
- **Akar Masalah:** Terjadi duplikasi prefix path API (`/api/api/content/...`) saat React mengambil data dari Laravel. Hal ini menyebabkan respon 404 dari server, yang dialihkan ke halaman default HTML (`welcome.blade.php`). React mencoba memecah (split) HTML string tersebut karena mengiranya JSON, yang berujung pada Fatal Error (Crash) dan me-rendernya menjadi layar hitam.
- **Solusi:** Menghapus prefix `/api` dari _endpoint fetch_ (`axios.get`) di dalam `Hero.jsx`, `About.jsx`, `Services.jsx`, dan `Works.jsx`. Hal ini menyelesaikan masalah sinkronisasi *backend-frontend* karena *base URL* Axios sudah dikonfigurasi otomatis ke `/api` dari `AuthContext.jsx`.

### Perbaikan Desain & *Grid Layout* yang Rusak
- **Akar Masalah:** Desain komponen **Services** dan **Works** sempat berantakan karena adanya perbedaan *class name* antara versi CSS murni (`service-card`) dengan *class name* yang ditulis di dalam React murni (`services__card`).
- **Solusi:** Menyesuaikan kembali seluruh penulisan variabel CSS class pada `Services.jsx` dan `Works.jsx` agar sama persis dengan spesifikasi di `services.css` dan `works.css`. *Padding* dan *hover effect* sudah berhasil dikembalikan.

### Perbaikan Bug HMR Infinite Reload
- **Akar Masalah:** Vite Development Server sempat dijalankan di latar belakang (background) menggunakan `npm run dev`, sehingga meninggalkan *file* *pointer* `public/hot`. Hal ini membuat *website* pada versi production diakses me-reload sendiri mencari port Vite Dev Server.
- **Solusi:** Menghapus _file_ `public/hot` dan melakukan `npm run build` ulang agar React sepenuhnya menggunakan _file production build_ yang solid dan stabil.

### Dinamisasi Statistik Pada Hero Section
- **Akar Masalah:** Angka statistik "50+ Projects", "30+ Clients", dan "2+ Years" di Hero (`Hero.jsx`) sebelumnya bersifat **statis** (hardcoded), sehingga tidak sinkron ketika Admin mengubah data lewat *dashboard* (yang sebelumnya hanya berefek di komponen `About.jsx`).
- **Solusi:** Melakukan *fetch* berlapis pada `Hero.jsx` untuk mengambil data JSON yang bersumber langsung dari _endpoint_ `/content/about`, sehingga jika data dari Admin berubah, maka secara simultan tampilan Hero dan About akan menampilkan angka yang sama.

---

## 8. Scaling Video on Scroll (Perombakan Besar)

Pada iterasi ini, dilakukan perombakan besar di mana **Services Section** (komponen, CSS, dan admin editor-nya) dihapus secara permanen untuk memberikan ruang pada desain yang lebih sinematik.

### 1. Komponen Baru (`ScalingVideo.jsx`)
- Menggantikan posisi komponen `Services`.
- **Fitur Animasi:** Menggunakan efek **GSAP ScrollTrigger (Scrub)**, di mana video bermula sebagai sebuah kotak kecil melengkung di tengah layar, kemudian saat di-scroll ke bawah, kotak tersebut secara perlahan mengembang hingga menjadi *fullscreen* (layar penuh) menutupi seluruh website.
- **Overlay Dinamis:** Menambahkan elemen transisi mulus seperti teks *Label* yang muncul, bayangan (*gradient overlay*), dan ikon **Play** di sudut kanan bawah.

### 2. Modul Admin Baru (`VideoEditor.jsx`)
- Fitur **Services** di *sidebar dashboard* telah diubah menjadi **Showreel Video**.
- Admin dapat mengganti video dengan **Direct Upload** (mengunggah file video lokal `.mp4`, `.webm` langsung ke server WBZ dengan kapasitas maksimum yang telah dinaikkan hingga **200 MB** per file).
- Admin juga dapat mengunggah **Poster Thumbnail** khusus yang akan muncul sebelum video berputar.
- Data disimpan di `storage/app/content/video.json`.
