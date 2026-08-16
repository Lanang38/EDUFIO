# 📚 Edufio — Penjadwalan Sesi Les

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-green) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8)

Mini app penjadwalan sesi les privat. Empat layar: **Pendaftaran → Pilih tanggal
→ Detail sesi → Ringkasan**, ditambah satu layar **Beranda** untuk mengelola
lebih dari satu siswa (lihat bagian [Keputusan](#-keputusan-yang-saya-ambil-dan-alasannya) di bawah).

---

## 🚀 Cara menjalankan dari nol

Butuh **Node.js 20+**, **npm**, dan akses ke sebuah database **MongoDB**
(lokal via `mongod`, atau gratis lewat MongoDB Atlas).

```bash
npm install
cp .env.example .env  # lalu isi MONGODB_URI di file ini
npm run dev
```

Buka `http://localhost:3000` di browser. Tampilan sudah disesuaikan untuk
desktop dan tablet, selain mode HP di DevTools.

Untuk build produksi:

```bash
npm run build
npm run start
```

> ⚠️ Tanpa `MONGODB_URI` yang valid, panggilan ke API akan gagal dengan pesan
> error yang menjelaskan langkah setupnya — lihat `src/lib/mongodb.ts`.

---

## 🛠️ Tumpukan teknologi

| Layer | Teknologi | Keterangan |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | Framework React untuk aplikasi full-stack |
| Styling | Tailwind CSS v4 | memakai palet warna Edufio sebagai design token |
| Tanggal/jam | `date-fns` | untuk aritmetika tanggal/jam |
| Database | **MongoDB** | via driver resmi `mongodb` (bukan Mongoose — koleksinya cuma dua dan skema-nya sudah dijamin TypeScript di `src/lib/types.ts`, jadi ODM tambahan tidak perlu) |

Komponen client tidak pernah bicara langsung ke MongoDB; semua CRUD lewat API routes di `src/app/api/`, dipanggil dari `src/lib/storage.ts` lewat `fetch`.

---

## 🗂️ Struktur singkat

```
src/
├── app/
│   ├── api/
│   │   ├── paket/
│   │   │   ├── route.ts              # GET (semua) & POST (buat) paket
│   │   │   └── [id]/
│   │   │       └── route.ts          # GET satu paket, DELETE paket + seluruh sesinya
│   │   └── sesi/
│   │       ├── route.ts              # GET (semua, atau ?paketId=... untuk satu paket) & POST (buat) sesi
│   │       └── [id]/
│   │           └── route.ts          # GET, PUT (update), DELETE satu sesi
│   │
│   ├── daftar/
│   │   └── page.tsx                  # Layar 1 — Pendaftaran
│   │
│   ├── paket/
│   │   └── [id]/
│   │       ├── pilih-tanggal/
│   │       │   └── page.tsx          # Layar 2 — Pilih tanggal
│   │       ├── detail-sesi/
│   │       │   └── page.tsx          # Layar 3 — Detail sesi (dipakai juga untuk edit sesi)
│   │       └── ringkasan/
│   │           └── page.tsx          # Layar 4 — Ringkasan
│   │
│   ├── page.tsx                      # Beranda — daftar semua siswa/paket
│   └── globals.css
│
├── components/                       # komponen UI yang dipakai ulang di 4 layar
│
└── lib/
    ├── types.ts                      # tipe data Paket & Sesi (dipakai bersama client & server)
    ├── mongodb.ts                    # koneksi MongoClient, cached lintas hot-reload di dev
    ├── db.ts                         # collection helper + konversi dokumen Mongo (_id) <-> Paket/Sesi (id)
    ├── storage.ts                    # "data layer" sisi client — fetch ke API routes, dipakai 4 layar
    ├── rules.ts                      # 4 aturan wajib: minimal H+3, kuota paket, bentrok jadwal, materi wajib
    └── format.ts                     # format tanggal Bahasa Indonesia
```


## 🧭 Keputusan yang saya ambil (dan alasannya)

**🗄️ Database = MongoDB, diakses lewat API routes Next.js — bukan localStorage.**
MongoDB digunakan agar data admin tersimpan di server, bukan di satu HP. Pola aksesnya: komponen client (`"use client"`) tidak pernah import driver MongoDB secara langsung. semua baca/tulis lewat `fetch` ke API routes di `src/app/api/`, yang baru disitu bicara ke MongoDB lewat `src/lib/db.ts`. Ini menjaga driver database tetap di sisi server (tidak ikut ter-bundle ke client) dan membuka jalan untuk validasi/otorisasi di server nanti kalau dibutuhkan.

**⚙️ Driver resmi `mongodb`, bukan Mongoose.** 
Hanya ada dua koleksi (`paket`, `sesi`) dengan bentuk data yang sudah didefinisikan sebagai tipe TypeScript di `types.ts`, dan tidak ada kebutuhan schema validation kompleks, hook, atau population ala Mongoose. Driver native lebih tipis dan cukup untuk kebutuhan ini.

**✅ Aturan bentrok, kuota, H+3, dan materi wajib tetap dicek di client (`rules.ts`), bukan dipindah ke API routes.** 
Ini konsisten dengan struktur sebelumnya dimana API routes sengaja dibuat sebagai CRUD polos (baca/tulis apa adanya) supaya perubahan database tidak mengubah logic aturan yang sudah diverifikasi. Trade-off-nya: seperti sebelum migrasi, seseorang yang memanggil API langsung (bukan lewat UI) bisa melewati aturan-aturan ini. Untuk pemakaian nyata dengan lebih dari satu admin tepercaya, ini juga masuk poin "Selanjutnya" di bawah validasi inti sebaiknya diulang di server.

**🔀 Pengecekan bentrok jadwal dicek lintas semua paket, bukan hanya dalam satu paket.** 
Brief tidak menyebutkan eksplisit, tapi secara operasional satu
admin/tutor yang sama tidak bisa mengajar dua siswa di jam yang tumpang
tindih, di lokasi berbeda sekalipun. Jadi `findConflict` di `rules.ts`
memeriksa seluruh sesi yang ada, bukan cuma sesi milik paket yang sedang
dijadwalkan.

**📅 Aturan "minimal 3 hari dari hari ini" saya terapkan sebagai H+3 dan seterusnya boleh dipilih (hari ini, H+1, H+2 terkunci).** 
Wireframe di `alur-aplikasi.png` memang menampilkan tanggal H+1 dan H+2 seperti bisa dipilih (tidak abu-abu), tapi teks aturan A eksplisit bilang "minimal 3 hari dari hari ini", dan brief sendiri menyebut wireframe adalah acuan alur &
aturan, bukan acuan desain — jadi saya ikuti teks aturannya, bukan shading di gambar.

**🏠 Ada layar Beranda yang tidak ada di wireframe.** 
Wireframe menggambarkan alur satu paket dari pendaftaran sampai ringkasan, tapi tidak menjelaskan apa yang terjadi setelah satu paket selesai dijadwalkan, atau bagaimana admin kembali ke paket siswa lain. Karena use case aslinya (WhatsApp + spreadsheet) jelas menangani banyak siswa sekaligus, saya tambahkan Beranda sebagai pintu masuk yang mendaftar semua paket dan progresnya.

**⏰ Jam mulai berupa pilihan tetap (kelipatan 30 menit, 06.00–21.30), bukan input jam bebas.**
Ini mengurangi kemungkinan admin mengetik jam yang ane (mis. 25.70) dan menyamai gaya dropdown yang sudah dipakai wireframe untuk "Jam mulai".

**📍 Field "Tempat" berubah label & placeholder mengikuti mode belajar**
Jadi "alamat lokasi" untuk tutor datang, atau "platform online" untuk online. Tetap satu field teks bebas (bukan link wajib/validasi URL) karena brief melarang fitur unggah berkas dan tidak meminta integrasi apa pun di sini.

**🔒 Sesi yang sudah tersimpan: tanggalnya tidak bisa diubah lagi dari layar edit, hanya jam, tempat, dan materi.**
Mengubah tanggal berarti perlu mengulang pengecekan bentrok & alur pilih-tanggal dari awal. Agar tidak membengkak, saya batasi: untuk pindah tanggal, hapus sesi lalu buat ulang sesi baru dengan tanggal yang benar. Ini trade-off sadar.

**🗑️ Paket bisa dihapus dari layar Ringkasan** 
(dengan konfirmasi) meski tidak diminta brief, perlu ada cara membatalkan pendaftaran yang salah ketik/coba-coba, khususnya karena tidak ada login untuk membedakan siapa yang mengubah data.

**🔐 Jumlah sesi & durasi paket dikunci setelah paket dibuat** 
(tidak bisa diedit lagi). Kalau bisa diubah setelah beberapa sesi sudah dijadwalkan dengan durasi/jam selesai lama, sesi yang sudah ada bisa jadi tidak konsisten dengan paket barunya. Untuk sekarang, solusinya: hapus paket, daftar ulang. Bukan solusi ideal untuk pemakaian jangka panjang.

---

## 💭 Hal yang menurut saya seharusnya berbeda dari brief

- **Aturan H+3 cukup kaku untuk kasus nyata.** 
Les privat sering butuh sesi darurat/pengganti dalam 1–2 hari (siswa sakit lalu minta jadwal ulang besok lusa). Brief tidak membedakan "sesi baru" vs "sesi pengganti" — kalau  ini nyata dipakai, saya akan menanyakan apakah aturan H+3 berlaku untuk reschedule juga, atau hanya sesi baru.

- **Tidak ada cara membatalkan/reschedule satu sesi yang sudah lewat tanpa mengurangi kuota paket permanen.** 
Kalau sesi batal karena siswa sakit, admin realistisnya perlu menjadwalkan ulang tanpa kehilangan kuota. Sekarang hapus+buat baru sudah cukup untuk itu, tapi tidak ada pembedaan "batal karena tutor" vs "sudah selesai dilaksanakan" — brief tidak minta status sesi (terlaksana/belum), padahal untuk laporan progres nyata itu penting.

- **Definisi "bentrok" tidak disebutkan mencakup lintas siswa atau tidak.**
  Saya asumsikan lintas siswa (lihat keputusan di atas), brief sebaiknya menegaskan ini karena mengubah logika inti aplikasi.
- **Tidak ada penyebutan zona waktu.**
  Karena semuanya berjalan di localStorage device sendiri, saya pakai waktu lokal perangkat apa adanya (WIB diasumsikan). Untuk aplikasi nyata yang mungkin dipakai admin dari beberapa daerah, ini perlu dipertegas.

---

## 🤖 Bagian yang dikerjakan dengan bantuan AI

Struktur project, tipe data, logic 4 aturan di `rules.ts`, layout 4 layar,
komponen UI, dan draf awal README ini dikerjakan bersama Claude di sesi ini,
mulai dari scaffolding `create-next-app` sampai build lolos tanpa error.
Setelah itu saya menjalankan dan menguji aplikasinya sendiri, lalu melakukan
beberapa perbaikan tanpa bantuan AI: menambahkan tombol kembali di layar
Detail sesi, memperbaiki tampilan alert/notifikasi, dan menyesuaikan layout
supaya lebih rapi di ukuran layar desktop dan tablet (sebelumnya lebih
condong mobile-first sesuai wireframe). Dokumentasi proses (tangkapan layar
percakapan dan momen AI salah) ada di `/dokumentasi` — **lihat catatan
penting di bawah**.

---

## 📋 Yang belum selesai / rencana 3 hari berikutnya

- [ ] Ulangi validasi 4 aturan wajib (H+3, kuota, bentrok, materi) di API routes,
  bukan cuma di client — sekarang siapa pun yang memanggil `/api/sesi`
  langsung (bukan lewat UI) bisa melewatinya.
- [ ] Izinkan edit tanggal sesi tanpa harus hapus+buat ulang.
- [ ] Izinkan edit jumlah sesi/durasi paket dengan penanganan yang aman untuk
  sesi yang sudah terlanjur dijadwalkan.
- [ ] Status sesi (terjadwal / sudah dilaksanakan / batal) untuk laporan progres
  yang lebih akurat daripada sekadar hitung jumlah baris.
- [ ] Unit test untuk `rules.ts` (kuota, bentrok, tanggal minimal) — ini logic
  paling kritis dan paling mudah dites terpisah dari UI.
- [ ] Pencarian/filter di Beranda kalau jumlah siswa sudah banyak.
- [ ] Aksesibilitas: label ARIA lebih lengkap di kalender, urutan fokus keyboard.

---

## ✅ Aturan wajib — cara memverifikasinya

| # | Aturan | Cara verifikasi |
|---|---|---|
| 1 | **Minimal H+3** | Di layar "Pilih tanggal": tiga tanggal terdekat (hari ini + 2 hari setelahnya) tidak bisa diklik. |
| 2 | **Kuota tidak melebihi paket** | Daftarkan paket 4 sesi, jadwalkan 4 sesi — tombol "+ Tambah sesi" di Ringkasan otomatis hilang, dan layar Pilih Tanggal menolak menambah sesi kalau diakses langsung lewat URL. |
| 3 | **Tidak boleh bentrok** | Jadwalkan satu sesi jam 10.00–11.30, lalu coba jadwalkan sesi lain (siswa sama atau beda) pada tanggal yang sama, jam mulai yang beririsan — muncul peringatan dan tombol simpan nonaktif. |
| 4 | **Materi wajib diisi** | Coba simpan sesi dengan materi kosong — tombol simpan nonaktif dan muncul pesan error di bawah field. |

## ✅ Link App

untuk melihat demo dari aplikasi web ini dapat dilihat melalui
https://edufio-gray.vercel.app/ 