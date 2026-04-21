import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. EXCLUSIÓN MANUAL INMEDIATA
  // Si es login, register o un archivo estático, NI SIQUIERA inicializamos Supabase.
  if (pathname.includes(".") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Definimos cuáles son las páginas de autenticación
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // CASO A: Usuario NO logueado intentando entrar a zona privada
  if (!user && !isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // CASO B: Usuario SÍ logueado intentando entrar a Login o Register (LO QUE BUSCAMOS)
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/"; // O a /dashboard si prefieres
    return NextResponse.redirect(url);
  }

  // Si no cae en ninguna de las anteriores, lo dejamos pasar
  return response;
}

export const config = {
  // Matcher ultra-simple para que no interfiera con nada más
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
