JUALIN AI — STARTER KIT (HP Android)

ISI PAKET
- index.html: tampilan aplikasi, generator, kalkulator laba, riwayat lokal.
- worker.js: backend proxy AI untuk Cloudflare Workers.
- manifest.webmanifest, sw.js, icon.svg, icon-512.png: berkas PWA dan ikon Android.

PENTING
1. API key tidak boleh dimasukkan ke index.html atau file publik.
2. Gemini API memiliki batas pemakaian dan ketentuan berbeda untuk paket gratis/berbayar. Periksa harga dan ketentuan terbaru di https://ai.google.dev/gemini-api/docs/pricing
3. Worker contoh ini adalah starter untuk uji coba. Sebelum dibagikan ke publik, batasi CORS ke domain aplikasi, tambahkan rate limiting/kuota, dan pantau penggunaan. CORS saja bukan pengaman terhadap semua penyalahgunaan.
4. Konten buatan AI perlu diperiksa sebelum dipublikasikan. Jangan mengirim data rahasia pelanggan.

LANGKAH A — HOSTING APLIKASI (contoh GitHub Pages)
1. Buat repository baru bernama jualin-ai.
2. Unggah index.html, manifest.webmanifest, sw.js, icon.svg ke root repository.
3. Aktifkan Settings > Pages > Deploy from a branch > main > /(root).
4. Tunggu sampai URL HTTPS GitHub Pages muncul. Buka dan tes tampilan.
5. Catatan: jika repository bukan root domain, semua file sudah memakai path relatif.

LANGKAH B — BACKEND AI DI CLOUDFLARE WORKERS
1. Buka https://dash.cloudflare.com/ dan masuk/buat akun sesuai ketentuan layanan.
2. Buka Workers & Pages lalu buat Worker baru.
3. Ganti kode Worker dengan isi worker.js dari paket ini lalu deploy.
4. Di pengaturan Worker, Variables and Secrets, tambahkan Secret bernama GEMINI_API_KEY. Nilainya adalah API key yang dibuat di Google AI Studio. Jangan membagikan key kepada siapa pun.
5. Deploy ulang bila diminta dan catat URL Worker, misalnya https://nama-worker.nama-akun.workers.dev.
6. Untuk produksi, batasi CORS pada domain GitHub Pages aplikasi dan tambahkan rate limiting. Jangan mengandalkan URL yang sulit ditebak sebagai keamanan.

LANGKAH C — HUBUNGKAN FRONTEND
1. Buka index.html melalui editor kode teks di HP.
2. Cari baris: const AI_ENDPOINT = "PASTE_CLOUDFLARE_WORKER_URL_HERE";
3. Ganti isi teks itu dengan URL Worker Anda, tanpa menambahkan /api/generate. Contoh: const AI_ENDPOINT = "https://nama-worker.nama-akun.workers.dev";
4. Simpan dan unggah ulang index.html ke repository.
5. Buka ulang situs, masukkan produk, lalu tekan Buat Konten. Jika gagal, cek URL Worker, Secret, kuota API, dan log Worker.

LANGKAH D — KEMAS JADI APK
1. Setelah situs HTTPS bekerja, buka https://www.pwabuilder.com/ di Chrome Android.
2. Masukkan URL situs PWA, lalu jalankan pemeriksaan.
3. Jika manifest/ikon belum diterima, perbaiki dahulu. Untuk Android packaging, ikuti instruksi PWABuilder terbaru dan pilih paket Android.
4. Uji paket yang dihasilkan sebelum dibagikan. Paket yang ditandatangani untuk Play Store dan APK untuk pemasangan langsung dapat berbeda.
5. Publikasi Google Play memerlukan akun developer berbayar dan persyaratan tambahan; pemasangan pribadi tidak sama dengan publikasi Play Store.

BATASAN
- AI online memerlukan internet.
- Riwayat disimpan pada penyimpanan browser perangkat dan bisa hilang jika data situs dihapus.
- Paket ini tidak mengimpor riwayat dari prototipe lama secara otomatis.
- Nama model pada worker bisa berubah/aksesnya bergantung ketersediaan akun. Jika model tidak tersedia, pilih model Flash yang aktif pada dokumentasi Gemini API.
