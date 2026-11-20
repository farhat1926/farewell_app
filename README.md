# Farewell Dinner — Futuristic Portal Invitation + Live Guest List

Undangan makan bersama bertema farewell, React + Vite + Framer Motion. Ada splash screen, amplop berubah menjadi portal berlubang, zoom sinematik ke dashboard, animasi partikel looping, dan RSVP yang disimpan di Google Sheets.

## 1. Jalankan

```bash
npm install
npm run dev
```

## 2. Buat spreadsheet untuk RSVP

1. Di Google Drive buat **Google Sheets baru**, misalnya `Daftar Tamu Farewell Dinner`.
2. Dari spreadsheet pilih **Ekstensi > Apps Script** (penting: skrip terikat pada spreadsheet tersebut).
3. Salin seluruh isi `google-apps-script/Code.gs` ke editor Apps Script, simpan.
4. Klik **Deploy > New deployment** (atau **Terapkan > Deployment baru**), pilih tipe **Web app**.
5. Pilih **Execute as: Me (akun saya)** dan **Who has access: Anyone (Siapa saja)**. Izinkan otorisasi Google yang diperlukan.
6. Salin **Web app URL** yang berakhiran `/exec`. **Jangan gunakan URL `/dev`**.
7. Di `src/data/event.js`, isi:

```js
  googleScriptUrl: 'https://script.google.com/macros/s/AKfycb.../exec',
```

8. Jalankan kembali aplikasi, isi nama tamu, pilih kehadiran, klik **SAVE MY SEAT**. Daftar akan muncul di bawah tombol dan baris otomatis masuk ke tab `RSVP` di spreadsheet.

**Penting:** Setelah mengubah `Code.gs`, deploy versi terbaru lewat **Deploy > Manage deployments > Edit > New version**. Jika Google Apps Script tidak menampilkan opsi publik (Anyone), akun/organisasi Anda mungkin membatasi izin berbagi.

## 3. Cara kerja

- Form mengirim `nama`, `status` dan `ID` unik melalui POST ke Google Apps Script.
- Browser melakukan pemeriksaan ulang melalui endpoint daftar tamu (JSONP) agar **tidak salah mengklaim sukses** pada permintaan `no-cors`.
- Nama baru dianggap tersimpan hanya setelah ID tadi ditemukan pada baris spreadsheet.
- Semua pengunjung bisa melihat daftar tamu yang tersimpan, bukan hanya di perangkat pengirim. Ada filter Semua, Hadir, Belum Bisa Memastikan, Tidak Bisa Hadir dan tombol refresh.
- Jika belum dikonfigurasi, form tidak mengklaim tersimpan: tombol dinonaktifkan dan petunjuk konfigurasi tampil. Tidak ada data tamu palsu.

## 4. Edit informasi acara

Semua informasi acara di `src/data/event.js`: tanggal, jam, lokasi, dress code, Google Maps, nomor WhatsApp jika masih diperlukan, dan `googleScriptUrl`. Data acara bawaan **hanya contoh**, bukan detail sebenarnya.

## 5. Keamanan dan privasi

**Publik:** Google Apps Script harus bisa diakses publik agar pengunjung tanpa akun Google dapat RSVP. Endpoint daftar mengembalikan nama dan status kehadiran ke setiap pengunjung halaman undangan. **Jangan masukkan nomor telepon, email, atau data sensitif.** Spreadsheet Anda sendiri tetap milik akun Google pemilik; jangan membagikan URL edit spreadsheet. Akun dengan pembatasan Workspace bisa jadi tidak mengizinkan deployment publik. Karena endpoint publik tidak memakai login/CAPTCHA, ada risiko spam atau pengisian nama palsu. Untuk undangan berskala besar, sebaiknya gunakan backend dengan rate limiting/autentikasi.

## 6. Struktur

- `src/components/SplashScreen.jsx`: splash/loading.
- `src/components/EnvelopeIntro.jsx`: amplop 3D → portal persegi → zoom.
- `src/components/Decorations.jsx`: partikel looping.
- `src/components/Hero.jsx`, `EventDetails.jsx`, `Countdown.jsx`: isi undangan.
- `src/components/RSVP.jsx`: form Save Your Seat dan Guest List di bawahnya.
- `src/services/guestbook.js`: sambungan Google Sheets, memuat dan menyimpan data.
- `google-apps-script/Code.gs`: backend penyimpanan di Google Sheets.
- `src/styles/global.css`: desain futuristik dan responsivitas.

## 7. Build produksi

```bash
npm run build
npm run preview
```

Jangan memublikasikan undangan sebelum mengetes bahwa entri yang baru dibuat muncul di spreadsheet, dan mencoba me-refresh halaman di HP/browser lain.

## Premium Hyperspace Edition
- `src/components/Hyperspace.jsx`: Canvas 2D spiral and accelerating star trails, capped resolution and 75/130 particles. Canvas unmounts after the 1.45 s dive.
- `src/styles/premium.css`: premium dashboard, circular portal and guest arrival glow.
- `src/components/DashboardNav.jsx`: responsive dashboard navigation.
- Guest highlight uses the verified submission ID from Google Sheets; no sample names added.
- The dashboard mounts after the intro exits, rather than during the warp. Reduced-motion skips the dive.
- If updating an existing deployment, copy your real event config and Apps Script URL from your existing `src/data/event.js`. Apps Script backend schema unchanged.

## Peringatan kerahasiaan undangan
Setelah splash screen, pengunjung sekarang melihat layar **Private Invitation** dan harus menekan tombol **SAYA MENGERTI & SETUJU** sebelum amplop muncul. Ubah redaksinya melalui `src/components/ConfidentialityNotice.jsx`; stylenya berada di `src/styles/premium.css`. Persetujuan ini tidak disimpan ke server dan akan muncul lagi saat membuka ulang halaman. Fitur ini hanya berupa pengingat/persetujuan, **bukan perlindungan teknis** terhadap pembagian tautan. Jika undangan benar-benar perlu dibatasi, tambahkan autentikasi atau token undangan unik di backend.


## Versi UFO Scroll Flight (November 2026)
- Privacy notice dihapus; splash screen langsung menuju amplop.
- `UfoFollower.jsx` sekarang bergerak kiri-kanan dan turun sepanjang viewport seiring scroll menggunakan `requestAnimationFrame` dan `transform: translate3d`.
- UFO tetap ringan karena tidak melakukan React state update pada setiap scroll dan berhenti saat komponen dilepas.
- Perubahan lainnya (hyperspace, RSVP, guest list, Google Sheets) tetap dipertahankan.
