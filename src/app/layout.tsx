import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// Usamos ruta relativa segura para evitar problemas con el alias
import Footer from "../components/Footer";

// Configuramos Poppins con los grosores que necesitamos para el B2B
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins', // Creamos la variable CSS para Tailwind
});

export const metadata: Metadata = {
  title: "Networks & Systems Perú | Plataforma B2B",
  description: "Infraestructura y telecomunicaciones corporativas de alto nivel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* EL SCRIPT GUARDIÁN: Evita el pantallazo blanco leyendo la memoria al instante */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      {/* NOTA DEL INGENIERO: Se quitaron los 'bg-gray' fijos de aquí.
        Ahora la clase 'font-sans' activa Poppins, y globals.css maneja los colores mate.
      */}
      <body className={`${poppins.variable} font-sans antialiased`}>
        
        {/* Este contenedor empuja el Footer siempre hacia abajo */}
        <div className="min-h-screen flex flex-col">
          
          {/* Aquí se renderizan todas tus páginas (Web y Admin) */}
          <main className="flex-grow">
            {children}
          </main>

          {/* AQUÍ ESTÁ EL FOOTER */}
          <Footer />

        </div>
        
      </body>
    </html>
  );
}