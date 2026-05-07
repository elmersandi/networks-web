import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/src/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    // ==========================================
    // BLOQUE 1: PROVEEDOR DE CREDENCIALES
    // Define cómo el usuario va a iniciar sesión (con correo y contraseña)
    // ==========================================
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      
      // ==========================================
      // BLOQUE 2: AUTORIZACIÓN Y VALIDACIÓN (El corazón de la seguridad)
      // Aquí revisamos paso a paso si el usuario tiene permiso para entrar
      // ==========================================
      async authorize(credentials) {
        console.log("📍 [PASO 1] Recibiendo intento de Login para:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ ERROR: Campos vacíos.");
          throw new Error("Faltan datos");
        }

        try {
          console.log("📍 [PASO 2] Buscando al usuario en la Base de Datos...");
          const usuario = await prisma.usuario.findUnique({
            where: { email: credentials.email }
          });

          if (!usuario) {
            console.log("❌ ERROR: El correo no existe en la BD.");
            throw new Error("Usuario no encontrado");
          }

          console.log("📍 [PASO 3] Verificando si la cuenta del usuario está aprobada...");
          if (usuario.estadoAcceso !== "APROBADO") {
            console.log("❌ ERROR: El usuario no tiene estado APROBADO.");
            throw new Error("Tu cuenta está pendiente de aprobación o bloqueada.");
          }

          console.log("📍 [PASO 4] Comparando contraseñas con bcryptjs...");
          const passwordValida = await bcrypt.compare(credentials.password, usuario.password);

          if (!passwordValida) {
            console.log("❌ ERROR: La contraseña es incorrecta.");
            throw new Error("Contraseña incorrecta");
          }

          console.log("✅ [ÉXITO] ¡Credenciales correctas! Generando sesión...");
          
          // ==========================================
          // BLOQUE 3: DATOS A EXPORTAR
          // Lo que devolvamos aquí, será lo que NextAuth guarde en la sesión
          // ==========================================
          return {
            id: usuario.id,
            name: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
          };

        } catch (error: unknown) {
          console.error("🔥 ERROR FATAL EN EL SERVIDOR DE LOGIN:", error);
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Error interno al intentar iniciar sesión");
        }
      }
    })
  ],

  // ==========================================
  // BLOQUE 4: CALLBACKS (Controladores de la Sesión y el Token)
  // Aquí inyectamos el ID y el ROL del usuario para poder usarlos en toda la web
  // ==========================================
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Tipamos el user para evitar el uso de 'any'
        const customUser = user as { id: string; rol: string };
        token.rol = customUser.rol;
        token.id = customUser.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Tipamos la session para evitar el uso de 'any'
        const customSessionUser = session.user as { id: string; rol: string };
        customSessionUser.rol = token.rol as string;
        customSessionUser.id = token.id as string;
      }
      return session;
    }
  },

  // ==========================================
  // BLOQUE 5: CONFIGURACIONES EXTRA
  // Rutas personalizadas, estrategias y seguridad
  // ==========================================
  pages: {
    signIn: '/admin/login', // Le decimos a NextAuth cuál es nuestra pantalla de login personalizada
  },
  session: {
    strategy: "jwt", // Usamos JSON Web Tokens
    maxAge: 30 * 24 * 60 * 60, // La sesión dura 30 días
  },
  secret: process.env.NEXTAUTH_SECRET, // Llave maestra de seguridad
};

// ==========================================
// BLOQUE 6: EXPORTACIÓN DEL MANEJADOR
// Las líneas mágicas que hacen que Next.js entienda las rutas GET y POST de Auth
// ==========================================
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };