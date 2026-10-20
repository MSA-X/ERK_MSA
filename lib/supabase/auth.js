import "server-only";
import { redirect } from "next/navigation";
import { buatClientSupabaseSesi } from "@/lib/supabase/session";

export async function wajibAdmin() {
  const supabase = await buatClientSupabaseSesi();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/admin/login");
  }

  return { supabase, user };
}
