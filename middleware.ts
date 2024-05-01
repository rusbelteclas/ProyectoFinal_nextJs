import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";


const protectedRoutes = [
  '/password',
  '/notas',
];

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createClient(request);

    const { data: { session } } = await supabase.auth.getSession();

    // Verificar si la ruta solicitada comienza con alguna de las rutas protegidas
    const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    // Redireccionar al usuario a la página de inicio de sesión si intenta acceder a una ruta protegida sin sesión activa
    if (isProtectedRoute && !session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return response;
  } catch (error) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export const config = {
  matcher: [
    // Coincide con todas las solicitudes excepto los archivos estáticos y el favicon
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};