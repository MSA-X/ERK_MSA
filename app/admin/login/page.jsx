import { redirect } from "next/navigation";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { masukAdmin } from "@/app/admin/actions";
import { buatClientSupabaseSesi } from "@/lib/supabase/session";

const pesanError = {
  "input-kosong": "Email dan password wajib diisi.",
  kredensial: "Email atau password salah. Periksa kembali data yang dimasukkan.",
  layanan: "Login belum dapat diproses. Coba lagi beberapa saat.",
};

export default async function HalamanLogin({ searchParams }) {
  const supabase = await buatClientSupabaseSesi();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin");
  }

  const { error } = await searchParams;
  const pesan = pesanError[error] ?? null;

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 py-12">
      <div>
        <h1 className="text-2xl font-extrabold">Masuk admin</h1>
        <p className="mt-1 text-sm text-teks-lembut">Khusus pemilik toko untuk mengelola produk.</p>
      </div>
      <form action={masukAdmin} className="flex flex-col gap-4">
        <Input label="Email" name="email" type="email" autoComplete="email" required />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        {pesan ? (
          <p className="text-sm text-bahaya" role="alert">
            {pesan}
          </p>
        ) : null}
        <Tombol type="submit">Masuk</Tombol>
      </form>
    </div>
  );
}
