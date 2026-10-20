import Link from "next/link";
import { TombolBandingkan } from "@/components/PerbandinganProduk";
import { formatRupiah } from "@/lib/format";

export default function KartuProduk({ produk }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar">
      <Link href={`/produk/${produk.id}`} className="group flex flex-1 flex-col">
        <img
          src={produk.foto_url}
          alt={produk.nama}
          className="aspect-square w-full bg-permukaan object-cover"
        />
        <div className="flex flex-1 flex-col gap-2 p-3 pb-2">
          <p className="text-xs text-teks-lembut">{produk.kategori}</p>
          <h3 className="font-semibold leading-snug group-hover:text-utama">{produk.nama}</h3>
          <p className="mt-auto self-start rounded-md bg-harga-latar px-2 py-0.5 text-sm font-bold text-harga">
            {formatRupiah(produk.harga)}
          </p>
        </div>
      </Link>
      <div className="p-3 pt-1">
        <TombolBandingkan produkId={produk.id} />
      </div>
    </article>
  );
}
