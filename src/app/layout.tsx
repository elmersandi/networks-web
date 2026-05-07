// Archivo: src/app/layout.tsx
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
  title: "Networks & Systems Perú",
  description: "Infraestructura y telecomunicaciones corporativas en Loreto.",
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
      {/* 
        1. Inyectamos la variable poppins.variable
        2. Usamos font-sans para que Tailwind la agarre
        3. antialiased hace que las letras se vean mucho más nítidas y premium 
      */}
      <body className={`${poppins.variable} font-sans antialiased bg-gray-50 text-gray-900`}>
        
        {/* Este contenedor empuja el Footer hacia abajo */}
        <div className="min-h-screen flex flex-col">
          
          {/* Aquí se renderizan todas tus páginas (Web y Admin) */}
          <main className="flex-grow">
            {children}
          </main>

          {/* AQUÍ ESTÁ EL FOOTER. Si esto está dentro del layout, sale en toda la web */}
          <Footer />

        </div>
        
      </body>
    </html>
  );
}