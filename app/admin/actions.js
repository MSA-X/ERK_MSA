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
