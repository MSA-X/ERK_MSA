"use server";

import { redirect } from "next/navigation";
import { buatClientSupabaseSesi } from "@/lib/supabase/session";

export async function masukAdmin(formData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/admin/login?error=input-kosong");
  }

  const supabase = await buatClientSupabaseSesi();
  let gagalTerhubung = false;
  let loginError = null;

  try {
    const hasil = await supabase.auth.signInWithPassword({ email, password });
    loginError = hasil.error;
  } catch {
    gagalTerhubung = true;
  }

  if (gagalTerhubung) {
    redirect("/admin/login?error=layanan");
  }

  if (loginError) {
    redirect("/admin/login?error=kredensial");
  }

  redirect("/admin");
}

export async function keluarAdmin() {
  const supabase = await buatClientSupabaseSesi();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function gantiPasswordAdmin(formData) {
  const supabase = await buatClientSupabaseSesi();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const passwordBaru = String(formData.get("password_baru") ?? "");
  const konfirmasiPassword = String(formData.get("konfirmasi_password") ?? "");

  if (!passwordBaru || !konfirmasiPassword) {
    redirect("/admin/password?status=input-kosong");
  }

  if (passwordBaru.length < 8) {
    redirect("/admin/password?status=terlalu-pendek");
  }

  if (passwordBaru !== konfirmasiPassword) {
    redirect("/admin/password?status=tidak-sama");
  }

  let gagalTerhubung = false;
  let updateError = null;

  try {
    const hasil = await supabase.auth.updateUser({ password: passwordBaru });
    updateError = hasil.error;
  } catch {
    gagalTerhubung = true;
  }

  if (gagalTerhubung || updateError) {
    redirect("/admin/password?status=gagal");
  }

  redirect("/admin/password?status=berhasil");
}
