// Archivo: src/middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

// Aquí le decimos al Guardián qué rutas debe proteger.
// Protege TODO lo que empiece con /admin, EXCEPTO login, registro y recuperar clave.
export const config = {
  matcher: ["/admin/((?!login|registro|recuperar).*)"],
};