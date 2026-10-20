# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
[SENDIRI] Implementasikan US-01 sesuai AGENTS.md dan docs/user-stories.md. Ambil produk dari Supabase melalui server.

**Hasil:**
Halaman `/` mengambil semua produk dari tabel `produk` di Supabase pada server, menggunakan `SUPABASE_SECRET_KEY`. Kartu menampilkan foto, kategori, nama, dan harga rupiah; pesan keadaan kosong ditampilkan jika tabel tidak berisi produk. `CatatanBelumAktif` dan data contoh tidak lagi dipakai di katalog.

Validasi: `npm run build` berhasil. Smoke test lokal ke `/` menghasilkan HTTP 200, merender 60 gambar produk dari database, dan tidak menampilkan pesan keadaan kosong.

**Perbaikan:**
Build pertama gagal karena helper Supabase yang diimpor halaman belum dibuat. Helper server-only ditambahkan di `lib/supabase/server.js`, lalu build yang sama berhasil. Tidak ada user story lain yang dikerjakan.

## US-02 Detail produk

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-03 Pesan via WhatsApp

**Prompt:**
[SENDIRI] Baca AGENTS.md, DESIGN.md, docs/PRD.md, dan docs/user-stories.md, lalu kerjakan hanya US-03. Aktifkan tombol "Pesan via WhatsApp" pada detail produk dengan nomor dari `toko.nomorWhatsApp`, pesan otomatis berisi nama dan harga rupiah dari Supabase, serta `encodeURIComponent`. Pertahankan struktur, desain, dan fitur yang sudah ada. Uji nomor tujuan, kesesuaian data database, nama berkarakter khusus, pembukaan link, dan jalankan `npm run build`. Catat hasil sebenarnya di jurnal US-03 tanpa menghapus jurnal lain, memasang dependency baru, atau menjalankan Git. Jangan mengklaim pengujian HP fisik jika belum dilakukan.

**Hasil:**
`components/TombolWhatsApp.jsx` sekarang merender tautan `https://wa.me/<nomor>?text=<pesan>` yang membuka tab baru dengan `rel="noopener noreferrer"`. Nomor memakai `toko.nomorWhatsApp` dari `lib/toko.js` (6282384298003). Pesan berisi nama produk dan harga dari `formatRupiah`, lalu di-encode memakai `encodeURIComponent`. Kelas tampilan tombol tetap dipertahankan.

Detail produk meneruskan produk hasil helper Supabase server yang sudah ada ke tombol; data contoh tidak lagi dipakai di halaman ini. Catatan tombol belum aktif dihapus. Halaman katalog tidak diubah dan perilaku `notFound()` pada detail tetap dipertahankan.

**Perbaikan:**
- Ditemukan tombol masih tanpa aksi dan detail masih memakai `cariProdukContoh`, berbeda dengan asumsi bahwa detail sudah terhubung database. Tombol diganti menjadi tautan WhatsApp; lookup detail memakai `ambilDaftarProduk()` yang sudah tersedia di server, lalu memilih produk berdasarkan ID, agar pesan sesuai database tanpa menambah fitur lain.
- `npm run build` berhasil tanpa error. Pengujian awal server lokal ditolak sandbox (`EACCES`) dan akses Supabase gagal (`fetch failed`); setelah dijalankan ulang dengan izin di luar sandbox, pemeriksaan berhasil. Tidak diperlukan perubahan konfigurasi aplikasi.
- Pengujian read-only ke Supabase menemukan 60 produk. Katalog menghasilkan HTTP 200 dan memuat tautan ke seluruh 60 produk. Detail ID 1, 7, dan 60 menghasilkan HTTP 200; nama dan harga di pesan cocok persis dengan database: Kopi Bubuk Robusta 250 g (Rp 45.000), Kopi Arabika Gayo 250 g (Rp 24.000), dan Kain Sasirangan Banjar 2 m (Rp 375.000). Nomor tujuan seluruhnya cocok dengan konfigurasi toko. ID 61 yang tidak ada dan `id-tidak-valid` menghasilkan HTTP 404.
- Database saat diuji tidak memiliki nama berkarakter khusus. Komponen aktual diuji melalui render server dengan fixture `Kopi & Teh + 50% #1? "Spesial" 🍵` dan harga 0, 15000, serta 1234567. Semuanya lulus: teks setelah decoding tetap utuh, harga sesuai `formatRupiah` (Rp 0, Rp 15.000, Rp 1.234.567), hanya ada parameter `text`, fragment kosong, dan nomor tujuan benar. Fixture tidak ditulis ke database.
- URL dari halaman nyata menghasilkan HTTP 302 dari `wa.me` ke `api.whatsapp.com`, kemudian HTTP 200 pada halaman WhatsApp; nomor dan pesan diteruskan dengan benar. Tidak ada pesan yang dikirim.
- Chrome headless berhasil mengklik tombol dan membuka tab `wa.me` pada viewport desktop 1280 px serta simulasi layar HP 390 px. Screenshot diperiksa: tombol terlihat, tinggi 48 px, dan halaman tidak meluber secara horizontal. Ini pengujian browser desktop dan simulasi viewport HP; pengujian pada perangkat HP fisik belum dilakukan.

## US-04 Login admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-05 Ganti password

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## Kustomisasi toko

**Prompt:**
Kerjakan Langkah 8: ubah identitas toko di `lib/toko.js` menjadi ERK MSA, tagline "Yang di cari , Ada disini", alamat "Jl Gerhana 3", jam buka "08:00", dan WhatsApp 082384298003 dalam format internasional. Periksa di localhost:3000 dan catat hasilnya.

**Hasil:**
Identitas toko diperbarui dengan struktur objek dan nama properti tetap. Nomor WhatsApp diubah menjadi 6282384298003. Pemeriksaan `http://localhost:3000` menghasilkan HTTP 200; nama, tagline, alamat, dan jam buka tampil sesuai permintaan, serta nama lama tidak ditemukan.

**Perbaikan:**
Tidak ada error saat pemeriksaan lokal dan tidak diperlukan perbaikan tambahan.

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
