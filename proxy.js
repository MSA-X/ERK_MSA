import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

function buatRespons(request) {
  return NextResponse.next({ request });
}

function salinCookie(responsSumber, responsTujuan) {
  responsSumber.cookies.getAll().forEach((cookie) => {
    const { name, value, ...options } = cookie;
    responsTujuan.cookies.set(name, value, options);
  });

  return responsTujuan;
}

export async function proxy(request) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    throw new Error("Konfigurasi Supabase untuk autentikasi server belum lengkap.");
  }

  let response = buatRespons(request);
  const supabase = createServerClient(supabaseUrl, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = buatRespons(request);
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  let user = null;

  try {
    const hasil = await supabase.auth.getUser();
    user = hasil.data.user;
  } catch {
    // Gangguan verifikasi diperlakukan sebagai sesi yang tidak valid.
  }

  const pathname = request.nextUrl.pathname;

  if (!user && pathname !== "/admin/login") {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.search = "";
    return salinCookie(response, NextResponse.redirect(loginUrl));
  }

  if (user && pathname === "/admin/login") {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    adminUrl.search = "";
    return salinCookie(response, NextResponse.redirect(adminUrl));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
