import "server-only";
import { createClient } from "@supabase/supabase-js";

export async function ambilDaftarProduk() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !secretKey) {
    throw new Error("SUPABASE_URL dan SUPABASE_SECRET_KEY harus diatur di environment server.");
  }

  const supabase = createClient(supabaseUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabase
    .from("produk")
    .select("id, nama, harga, deskripsi, foto_url, kategori, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Gagal mengambil katalog produk: ${error.message}`);
  }

  return data;
}

export async function ambilProdukBerdasarkanId(id) {
  if (!/^\d+$/.test(id)) {
    return null;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !secretKey) {
    throw new Error("SUPABASE_URL dan SUPABASE_SECRET_KEY harus diatur di environment server.");
  }

  const supabase = createClient(supabaseUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabase
    .from("produk")
    .select("id, nama, harga, deskripsi, foto_url, kategori, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal mengambil detail produk: ${error.message}`);
  }

  return data;
}
