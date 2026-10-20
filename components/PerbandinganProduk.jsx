"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const KUNCI_PENYIMPANAN = "produk-dibandingkan";
const ACARA_PERUBAHAN = "perbandingan-produk-berubah";

function bacaPilihan() {
  try {
    const tersimpan = JSON.parse(localStorage.getItem(KUNCI_PENYIMPANAN) ?? "[]");

    if (!Array.isArray(tersimpan)) {
      return [];
    }

    return [...new Set(tersimpan.map(String).filter((id) => /^\d+$/.test(id)))].slice(0, 2);
  } catch {
    return [];
  }
}

function simpanPilihan(ids) {
  localStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(ids));
  window.dispatchEvent(new Event(ACARA_PERUBAHAN));
}

function urlPerbandingan(ids) {
  return ids.length > 0 ? `/bandingkan?produk=${ids.join(",")}` : "/bandingkan";
}

export function TombolBandingkan({ produkId }) {
  const id = String(produkId);
  const [pilihan, setPilihan] = useState([]);
  const [pesan, setPesan] = useState("");
  const [siap, setSiap] = useState(false);

  const sinkronkan = useCallback(() => {
    setPilihan(bacaPilihan());
    setSiap(true);
  }, []);

  useEffect(() => {
    sinkronkan();
    window.addEventListener("storage", sinkronkan);
    window.addEventListener(ACARA_PERUBAHAN, sinkronkan);

    return () => {
      window.removeEventListener("storage", sinkronkan);
      window.removeEventListener(ACARA_PERUBAHAN, sinkronkan);
    };
  }, [sinkronkan]);

  const sudahDipilih = pilihan.includes(id);

  function ubahPilihan() {
    setPesan("");

    if (sudahDipilih) {
      simpanPilihan(pilihan.filter((produkIdTerpilih) => produkIdTerpilih !== id));
      return;
    }

    if (pilihan.length >= 2) {
      setPesan("Maksimal dua produk bisa dibandingkan.");
      return;
    }

    simpanPilihan([...pilihan, id]);
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={ubahPilihan}
        aria-pressed={sudahDipilih}
        className="inline-flex items-center justify-center rounded-lg border border-garis bg-latar px-3 py-2 text-sm font-semibold text-teks transition-colors hover:border-utama hover:text-utama"
      >
        {sudahDipilih ? "Hapus dari perbandingan" : "Bandingkan"}
      </button>
      {siap && pilihan.length > 0 ? (
        <Link
          href={urlPerbandingan(pilihan)}
          className="text-center text-xs font-semibold text-utama underline underline-offset-4"
        >
          Lihat perbandingan ({pilihan.length}/2)
        </Link>
      ) : null}
      {pesan ? (
        <p className="text-xs text-bahaya" role="alert">
          {pesan}
        </p>
      ) : null}
    </div>
  );
}

export function HapusDariPerbandingan({ produkId, pilihan }) {
  const router = useRouter();

  function hapus() {
    const pilihanBaru = pilihan.map(String).filter((id) => id !== String(produkId));
    simpanPilihan(pilihanBaru);
    router.replace(urlPerbandingan(pilihanBaru));
  }

  return (
    <button
      type="button"
      onClick={hapus}
      className="inline-flex items-center justify-center rounded-lg border border-garis bg-latar px-4 py-2.5 text-sm font-semibold text-bahaya transition-colors hover:border-bahaya"
    >
      Hapus dari perbandingan
    </button>
  );
}

export function MuatPilihanPerbandingan() {
  const router = useRouter();
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    const pilihan = bacaPilihan();

    if (pilihan.length > 0) {
      router.replace(urlPerbandingan(pilihan));
      return;
    }

    setSiap(true);
  }, [router]);

  if (!siap) {
    return <p className="text-teks-lembut" role="status">Memuat pilihan produk...</p>;
  }

  return (
    <div className="rounded-xl border border-garis bg-permukaan p-5">
      <p className="text-teks-lembut">Belum ada produk yang dipilih untuk dibandingkan.</p>
      <Link href="/" className="mt-3 inline-block font-semibold text-utama underline underline-offset-4">
        Pilih produk dari katalog
      </Link>
    </div>
  );
}
