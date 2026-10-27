# 🇮🇩 Lapor RT/RW — Sistem Informasi & Manajemen Komunitas Warga

Sistem Informasi & Manajemen Terpadu Lingkungan RT/RW modern berbasis web untuk mengelola administrasi kependudukan, transparansi keuangan kas, notifikasi darurat cepat, forum warga, dan direktori jual beli antar warga.

---

## 🌟 Fitur Utama

- 🚨 **Notifikasi & Respon Darurat Cepat**: Pelaporan insiden darurat real-time dengan sirene peringatan, kategori darurat (Kebakaran, Medis, Keamanan, Bencana), dan respon cepat tanggap warga.
- 📋 **Administrasi Kependudukan & Persuratan**: Pengajuan surat pengantar domisili, SKCK, surat kematian/kelahiran, serta persetujuan digital oleh Ketua RT/RW.
- 💰 **Transparansi Keuangan Kas RT/RW**: Laporan pemasukan dan pengeluaran kas lingkungan, grafik arus kas, filter per RT/RW, dan ekspor laporan keuangan.
- 🛒 **Pasar & Jual Beli Antar Warga**: Direktori produk, kuliner rumahan, serta jasa antar warga untuk mendukung perputaran ekonomi lokal.
- 📢 **Pusat Informasi & Pengumuman**: Berita lingkungan warga, peringatan cuaca BMKG terintegrasi, dan agenda kerja bakti / posyandu.
- 💬 **Forum Diskusi & Aspirasi Warga**: Wadah musyawarah daring warga RT/RW yang transparan dan tertib.
- 👥 **Simulasi Multi-Peran (RBAC)**: Berganti peran secara instan antara **Penduduk**, **Ketua RT**, dan **Pengurus RW** untuk menguji hak akses masing-masing modul.

---

## 🛠️ Arsitektur & Teknologi

- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Grafik & Visualisasi**: [Recharts](https://recharts.org/)
- **Pengujian Unit**: Node.js Test Runner + TSX

---

## 🚀 Panduan Menjalankan di Komputer Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) (versi 18 ke atas)
- [npm](https://www.npmjs.com/) (versi 9 ke atas)

### Langkah Instalasi & Menjalankan

1. **Pasang Dependensi**:
   ```bash
   npm install
   ```

2. **Jalankan Server Lokal (Development)**:
   ```bash
   npm run dev
   ```

   Buka peramban (browser) di:
   - **Localhost**: [http://localhost:3000](http://localhost:3000)

3. **Build untuk Produksi**:
   ```bash
   npm run build
   ```

4. **Uji Coba Otomatis (Testing)**:
   ```bash
   npm test
   ```

---

## 📁 Struktur Direktori

```text
├── public/              # Aset statis & Favicon
├── src/
│   ├── components/      # Komponen UI (Header, Sidebar, Modal, Kartu)
│   ├── data/            # Data inisial dan mock lingkungan
│   ├── pages/           # Halaman fitur (Beranda, Keuangan, Persuratan, dll.)
│   ├── types/           # Definisi TypeScript data model & RBAC
│   ├── utils/           # Logika bisnis sipil & pengujian unit
│   ├── App.tsx          # Komponen utama aplikasi
│   ├── main.tsx         # Entry point aplikasi
│   └── index.css        # Konfigurasi Tailwind & tema warna
├── package.json         # Konfigurasi dependensi & scripts
├── tsconfig.json        # Konfigurasi kompilasi TypeScript
└── vite.config.ts       # Konfigurasi Vite
```

---

Dibuat untuk memudahkan warga dan pengurus RT/RW dalam mewujudkan lingkungan yang aman, tertib, dan transparan.
