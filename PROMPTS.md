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

**Hasil:**

**Perbaikan:**

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

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
