// Archivo: src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Usamos ruta relativa segura para evitar problemas con el alias
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        
        {/* Este contenedor empuja el Footer hacia abajo */}
        <div className="min-h-screen flex flex-col">
          
          {/* Aquí se renderizan todas tus páginas */}
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