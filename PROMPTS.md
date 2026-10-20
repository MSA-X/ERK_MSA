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
[SENDIRI] Baca AGENTS.md, DESIGN.md, docs/PRD.md, docs/rancangan-teknis.md, dan docs/user-stories.md, lalu kerjakan hanya US-02. Buat atau perbaiki `/produk/[id]` dengan Next.js 16 App Router agar mengambil satu produk berdasarkan ID langsung dari Supabase di sisi server, menampilkan foto, kategori, nama, harga rupiah, dan deskripsi, serta memanggil `notFound()` jika produk tidak ada. Pastikan `params` di-await, kartu katalog menuju detail yang sesuai, desain tetap responsif, US-01 tidak berubah, dan `npm run build` berhasil. Uji ID 1, beberapa ID lain, ID 999999, format rupiah, serta tampilan desktop dan HP. Jangan menambah dependency, mengakses Supabase dari Client Component, menyimpan kredensial di source code, atau menjalankan Git.

**Hasil:**
Halaman `/produk/[id]` tetap menjadi Server Component dan sekarang memanggil `ambilProdukBerdasarkanId(id)`. Helper tersebut melakukan query langsung ke tabel `produk` dengan `.eq("id", id).maybeSingle()` dan hanya memilih kolom produk yang diperlukan. Halaman menggunakan `const { id } = await params`, menampilkan foto, kategori, nama, harga melalui `formatRupiah`, dan deskripsi. Hasil kosong diteruskan ke `notFound()` sehingga halaman 404 tampil. ID nonangka juga diperlakukan sebagai produk tidak ditemukan tanpa mengirim query ID yang tidak valid ke Supabase.

Komponen `KartuProduk` sudah memiliki tautan `/produk/${produk.id}`, sehingga tidak memerlukan perubahan. Implementasi katalog US-01 dan tombol WhatsApp yang sudah ada tidak diubah.

**Perbaikan:**
- Ditemukan halaman detail sudah memakai data Supabase, tetapi masih mengambil seluruh daftar produk melalui `ambilDaftarProduk()` lalu mencari ID di memori. Ditambahkan helper server-only untuk mengambil satu produk langsung berdasarkan ID, lalu halaman detail diubah memakai helper tersebut. Tidak ada dependency atau kredensial baru yang ditambahkan.
- `npm run build` berhasil tanpa error terkait US-02. Pemeriksaan statis memastikan halaman meng-await `params`, memanggil `notFound()`, tidak memakai data contoh atau query daftar, helper memakai filter ID dan `maybeSingle()`, serta kartu katalog membentuk URL detail yang benar. Satu perintah pemeriksaan statis awal gagal karena quoting pada perintah uji, bukan karena kode aplikasi; perintah diperbaiki dan pemeriksaan lulus.
- Smoke test read-only membandingkan halaman dengan Supabase. `/produk/1`, `/produk/7`, dan `/produk/60` menghasilkan HTTP 200; foto, kategori, nama, harga, dan deskripsi sama dengan database. Harga tampil sebagai Rp 45.000, Rp 24.000, dan Rp 375.000. Kartu ketiga produk pada katalog mengarah ke detail yang sesuai. `/produk/999999` menghasilkan HTTP 404 dan halaman tidak ditemukan.
- Pengujian visual melalui Chrome headless lulus pada desktop 1280 px dan emulasi viewport HP 390 px. Pada viewport 390 px, lebar dokumen tetap 390 px dan tidak ada elemen detail yang melampaui viewport. Screenshot kedua ukuran diperiksa dan tata letak tampil sesuai desain. Ini pengujian emulasi viewport browser; perangkat HP fisik tidak diuji.

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
[SENDIRI] Baca AGENTS.md, DESIGN.md, docs/PRD.md, docs/rancangan-teknis.md, docs/user-stories.md, dan PROMPTS.md, lalu kerjakan hanya US-04. Buat login admin dengan email dan password melalui Supabase Auth di Server Action dan kelola sesi cookie memakai `@supabase/ssr` serta `SUPABASE_PUBLISHABLE_KEY`. Login berhasil harus menuju `/admin`; kegagalan harus menampilkan pesan aman. Pengguna yang sudah login dan membuka `/admin/login` harus dialihkan ke `/admin`. Aktifkan tombol keluar agar mengakhiri sesi dan menuju `/admin/login`. Jangan membuat registrasi, menyimpan token di localStorage, memakai secret key untuk login, mengerjakan proteksi US-06, memasang dependency, atau menjalankan Git. Uji kredensial valid, password salah, email tidak terdaftar, input kosong, redirect, logout, persistensi sesi, dan `npm run build`, serta catat hanya hasil yang benar-benar diuji.

**Hasil:**
Halaman `/admin/login` sekarang memiliki form email dan password yang mengirim data langsung ke Server Action `masukAdmin`. Action melakukan validasi input di server, memanggil `supabase.auth.signInWithPassword`, menyimpan sesi melalui cookie yang dikelola `@supabase/ssr`, dan mengarahkan login berhasil ke `/admin`. Kesalahan kredensial dan gangguan layanan dipetakan ke pesan Indonesia yang tetap generik sehingga detail internal tidak tampil.

Client sesi dibuat per request menggunakan `SUPABASE_URL` dan `SUPABASE_PUBLISHABLE_KEY` dari environment server. Cookie dibaca dan ditulis melalui `cookies()` Next.js 16; tidak ada Supabase client pada Client Component, token di localStorage, kredensial hardcode, service-role key untuk login, atau fitur registrasi.

Halaman login memeriksa pengguna melalui `auth.getUser()` dan mengarahkan sesi yang sudah login ke `/admin`. Tombol "Keluar" di `NavAdmin` sekarang berupa form Server Action yang memanggil `auth.signOut()` lalu mengarahkan ke `/admin/login`. Proteksi seluruh rute admin tidak dibuat karena merupakan US-06.

**Perbaikan:**
- Ditemukan form login dan tombol keluar sebelumnya hanya berupa tampilan tanpa action, serta masih memuat penanda `CatatanBelumAktif`. Ditambahkan helper sesi Supabase SSR, dua Server Action untuk masuk dan keluar, pesan error aman, pemeriksaan sesi pada halaman login, dan form logout. Penanda belum aktif khusus login dihapus.
- `npm run build` berhasil. Pemeriksaan statis memastikan autentikasi memakai Server Action, `@supabase/ssr`, publishable key, dan cookie server; source autentikasi tidak memakai `SUPABASE_SECRET_KEY`.
- Smoke test menghasilkan HTTP 200 untuk `/`, `/produk/1`, `/admin`, dan `/admin/login`, sehingga US-01 sampai US-03 tetap dapat dibuka. Form login server-rendered memuat email, password, dan tombol "Masuk" tanpa catatan belum aktif.
- Pengujian browser untuk input kosong berhasil: Server Action mengarahkan ke `/admin/login?error=input-kosong` dan menampilkan "Email dan password wajib diisi." Pengujian email yang tidak terdaftar berhasil: halaman menampilkan pesan generik "Email atau password salah", tidak menampilkan email, password, detail error Supabase, atau membuat cookie autentikasi.
- Tombol keluar terbukti tersambung ke Server Action dan mengarahkan browser tanpa sesi ke `/admin/login`. Kredensial akun admin tidak tersedia di environment atau prompt, sehingga login valid, password salah pada akun yang benar-benar terdaftar, redirect setelah login valid, pengalihan pengguna yang sudah login, pengakhiran sesi terautentikasi, dan persistensi sesi setelah reload belum diuji. Pengujian tersebut perlu dilakukan memakai akun admin yang sudah dibuat di Supabase Authentication; kredensial tidak ditambahkan ke source code.

## US-05 Ganti password

**Prompt:**
[SENDIRI] Baca AGENTS.md, DESIGN.md, docs/PRD.md, docs/rancangan-teknis.md, docs/user-stories.md, dan PROMPTS.md, lalu kerjakan hanya US-05. Buat form `/admin/password` untuk password baru dan konfirmasi, validasi minimal 8 karakter dan kecocokan di server, verifikasi pengguna aktif dengan Supabase Auth, kemudian ubah password melalui `auth.updateUser()` dalam Server Action. Pengguna tanpa sesi harus ditolak oleh halaman dan action. Tampilkan pesan berhasil "Password berhasil diperbarui" atau pesan error yang aman. Jangan memakai Admin API, secret key, database manual, localStorage, URL, log, atau jurnal untuk menyimpan password; jangan membuat reset email atau proteksi global US-06. Pertahankan US-04, jalankan pengujian yang tersedia dan `npm run build`, serta catat keterbatasan pengujian dengan jujur.

**Hasil:**
Halaman `/admin/password` sekarang memeriksa pengguna aktif melalui `auth.getUser()` di server sebelum menampilkan form. Pengguna tanpa sesi diarahkan ke `/admin/login`. Form memakai komponen `Input` dan `Tombol` yang sudah tersedia, memiliki input password baru dan konfirmasi dengan batas minimal 8 karakter di HTML, lalu mengirim ke Server Action `gantiPasswordAdmin`.

Server Action membuat client sesi berbasis cookie dan publishable key, memverifikasi pengguna lagi dengan `auth.getUser()`, lalu memvalidasi input kosong, panjang minimal 8 karakter, dan kecocokan kedua nilai. Hanya setelah semua pemeriksaan lulus action memanggil `auth.updateUser({ password })`. Hasil sukses mengarah ke status tetap yang menampilkan "Password berhasil diperbarui"; kegagalan memakai pesan Indonesia yang aman. Nilai password tidak dimasukkan ke URL, log aplikasi, jurnal, database manual, atau localStorage.

**Perbaikan:**
- Ditemukan halaman ganti password sebelumnya hanya berupa form tanpa action dan masih memuat `CatatanBelumAktif`. Form dihubungkan ke Server Action, pemeriksaan sesi ditambahkan pada halaman dan action, semua validasi wajib ditambahkan di server, pesan status ditambahkan, dan penanda belum aktif dihapus.
- `npm run build` berhasil. Pemeriksaan statis memastikan `getUser()` dijalankan sebelum `updateUser()`, validasi server tersedia, action tidak memakai `SUPABASE_SECRET_KEY`, dan tidak ada pencatatan password.
- Tanpa sesi, GET `/admin/password` menghasilkan HTTP 307 ke `/admin/login` dan form tidak dirender. Pemanggilan langsung Server Action tanpa cookie sesi menghasilkan HTTP 303 ke `/admin/login` sebelum validasi atau perubahan pengguna; URL redirect tidak memuat password.
- Smoke test `/`, `/produk/1`, dan `/admin/login` menghasilkan HTTP 200. Pengujian login gagal melalui Server Action US-04 tetap menghasilkan redirect error generik dan password tidak masuk URL. Log server selama pengujian diperiksa dan tidak menampilkan nilai password.
- Kredensial akun admin tidak tersedia di environment atau prompt. Karena itu membuka form setelah login, pengujian input kosong/kurang dari 8 karakter/konfirmasi berbeda pada sesi valid, perubahan password valid, pesan sukses dari perubahan nyata, logout, login dengan password baru, serta penolakan password lama belum diuji. Pengujian tersebut harus dilakukan dengan akun admin Supabase yang sudah ada; tidak ada password asli yang ditambahkan ke source code atau jurnal.

## US-06 Proteksi halaman admin

**Prompt:**
[SENDIRI] Baca AGENTS.md, DESIGN.md, docs/PRD.md, docs/rancangan-teknis.md, docs/user-stories.md, docs/checklist-keamanan.md, dan PROMPTS.md, lalu kerjakan hanya US-06. Lindungi `/admin` beserta seluruh subhalamannya, kecuali `/admin/login`, memakai Proxy Next.js 16, Supabase Auth, `@supabase/ssr`, cookie server, dan `auth.getUser()`. Tangani refresh cookie, hindari redirect loop, tambahkan pemeriksaan autentikasi pada Server Component dan setiap Server Action yang mengubah data, pertahankan US-01 sampai US-05, jalankan pengujian tanpa dan dengan sesi jika kredensial tersedia, serta jalankan `npm run build` tanpa mengarang hasil pengujian.

**Hasil:**
`proxy.js` di root project sekarang mencocokkan seluruh `/admin/:path*`, membuat client Supabase SSR memakai `SUPABASE_URL` dan `SUPABASE_PUBLISHABLE_KEY`, memverifikasi pengguna melalui `auth.getUser()`, serta meneruskan pembaruan cookie ke request dan response. Pengguna tanpa sesi diarahkan ke `/admin/login`, sedangkan pengguna terautentikasi yang membuka halaman login diarahkan ke `/admin`.

Helper server `wajibAdmin()` ditambahkan untuk verifikasi berlapis. Helper ini dipakai oleh halaman `/admin`, `/admin/password`, `/admin/produk/baru`, dan `/admin/produk/[id]/ubah`, sehingga halaman tidak hanya mengandalkan Proxy. Server Action ganti password juga memakai helper tersebut sebelum membaca input atau memanggil `auth.updateUser()`. Saat ini belum ada Server Action tambah, ubah, atau hapus produk; form produk masih merupakan fitur US-08/US-09 yang belum aktif, sehingga tidak ada endpoint mutasi produk yang dapat dipanggil langsung.

**Perbaikan:**
- Ditemukan halaman utama admin, tambah produk, dan ubah produk belum memiliki pemeriksaan sesi. Ditambahkan pemeriksaan server bersama pada seluruh halaman admin yang dilindungi. Keterangan lama bahwa halaman admin belum terlindungi dihapus, sedangkan penanda data contoh US-07 tetap dipertahankan.
- Ditemukan belum ada Proxy Next.js 16. Ditambahkan `proxy.js` dengan matcher khusus rute admin, pengecualian login, verifikasi `getUser()`, perilaku gagal-tertutup ketika verifikasi bermasalah, serta penyalinan cookie hasil refresh ke response termasuk response redirect.
- `npm run build` berhasil pada Next.js 16.3.8. Build mengenali semua halaman admin sebagai route dinamis dan mengenali `Proxy (Middleware)` tanpa error.
- Tanpa cookie sesi, pengujian HTTP produksi untuk `/admin`, `/admin/password`, `/admin/produk/baru`, dan `/admin/produk/1/ubah` masing-masing menghasilkan HTTP 307 ke `/admin/login`. `/admin/login` menghasilkan HTTP 200. Mengikuti redirect dari `/admin` berakhir di `/admin/login` dengan HTTP 200, sehingga tidak ditemukan redirect loop.
- Pemanggilan langsung Server Action `gantiPasswordAdmin` tanpa cookie melalui endpoint login menghasilkan HTTP 303 ke `/admin/login`. Ini menguji pemeriksaan di dalam action secara terpisah dari proteksi URL halaman; operasi perubahan pengguna tidak dijalankan.
- Pemeriksaan source memastikan seluruh halaman admin yang tersedia memanggil `wajibAdmin()`, action perubahan password memverifikasi pengguna, dan kode autentikasi tidak memakai `NEXT_PUBLIC_`, `SUPABASE_SECRET_KEY`, atau `localStorage`. Tidak ditemukan Server Action mutasi produk karena fitur tambah, ubah, dan hapus belum diimplementasikan.
- Smoke test produksi dengan koneksi Supabase menghasilkan HTTP 200 untuk `/` dan `/produk/1`; halaman login juga HTTP 200. Build seluruh route berhasil, sehingga tidak ditemukan regresi build pada US-01 sampai US-05. Uji awal di sandbox sempat menghasilkan `fetch failed` pada halaman publik karena akses jaringan dibatasi; pengujian diulang dengan akses jaringan dan berhasil.
- Kredensial akun admin tidak tersedia di environment atau prompt. Karena itu login valid, akses seluruh halaman dengan sesi valid, persistensi sesi setelah reload, refresh cookie sesi nyata, logout dari sesi terautentikasi, dan penolakan akses setelah logout belum diuji. Pengujian tersebut tetap memerlukan akun admin Supabase yang sudah ada; tidak ada kredensial yang ditambahkan ke source code atau jurnal.

## Kustomisasi toko

**Prompt:**
Kerjakan Langkah 8: ubah identitas toko di `lib/toko.js` menjadi ERK MSA, tagline "Yang di cari , Ada disini", alamat "Jl Gerhana 3", jam buka "08:00", dan WhatsApp 082384298003 dalam format internasional. Periksa di localhost:3000 dan catat hasilnya.

**Hasil:**
Identitas toko diperbarui dengan struktur objek dan nama properti tetap. Nomor WhatsApp diubah menjadi 6282384298003. Pemeriksaan `http://localhost:3000` menghasilkan HTTP 200; nama, tagline, alamat, dan jam buka tampil sesuai permintaan, serta nama lama tidak ditemukan.

**Perbaikan:**
Tidak ada error saat pemeriksaan lokal dan tidak diperlukan perbaikan tambahan.

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
