import Link from "next/link";
import {
  HapusDariPerbandingan,
  MuatPilihanPerbandingan,
} from "@/components/PerbandinganProduk";
import { formatRupiah } from "@/lib/format";
import { ambilProdukBerdasarkanIds } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function ambilIds(nilai) {
  const parameter = Array.isArray(nilai) ? nilai[0] : nilai;

  if (!parameter) {
    return [];
  }

  return [...new Set(parameter.split(",").filter((id) => /^\d+$/.test(id)))].slice(0, 2);
}

export default async function HalamanPerbandingan({ searchParams }) {
  const { produk } = await searchParams;
  const pilihan = ambilIds(produk);

  if (pilihan.length === 0) {
    return (
      <section className="flex flex-col gap-5 py-8 sm:py-12">
        <h1 className="text-3xl font-extrabold tracking-tight">Bandingkan produk</h1>
        <MuatPilihanPerbandingan />
      </section>
    );
  }

  const daftarProduk = await ambilProdukBerdasarkanIds(pilihan);
  const produkMenurutId = new Map(daftarProduk.map((item) => [String(item.id), item]));

  return (
    <section className="flex flex-col gap-6 py-8 sm:py-12">
      <div>
        <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
          Kembali ke katalog
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Bandingkan produk</h1>
        <p className="mt-2 text-sm text-teks-lembut">Bandingkan hingga dua produk pilihanmu.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {pilihan.map((id) => {
          const item = produkMenurutId.get(id);

          if (!item) {
            return (
              <article key={id} className="flex min-h-64 flex-col justify-between gap-4 rounded-2xl border border-garis bg-permukaan p-5">
                <div>
                  <h2 className="text-xl font-bold">Produk tidak ditemukan</h2>
                  <p className="mt-2 text-sm leading-relaxed text-teks-lembut">
                    Produk ini mungkin sudah dihapus dari katalog. Hapus pilihan ini untuk melanjutkan.
                  </p>
                </div>
                <HapusDariPerbandingan produkId={id} pilihan={pilihan} />
              </article>
            );
          }

          return (
            <article key={item.id} className="flex flex-col gap-4 rounded-2xl border border-garis bg-latar p-4">
              <img
                src={item.foto_url}
                alt={item.nama}
                className="aspect-square w-full rounded-xl bg-permukaan object-cover"
              />
              <div className="flex flex-1 flex-col gap-3">
                <p className="text-sm text-teks-lembut">{item.kategori}</p>
                <h2 className="text-xl font-bold leading-tight">{item.nama}</h2>
                <p className="self-start rounded-md bg-harga-latar px-3 py-1 font-bold text-harga">
                  {formatRupiah(item.harga)}
                </p>
                <p className="flex-1 leading-relaxed text-teks-lembut">{item.deskripsi}</p>
                <HapusDariPerbandingan produkId={item.id} pilihan={pilihan} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
