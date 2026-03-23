import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Cargamos la fuente Inter, optimizada para nuestra web
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "N&S Perú | Telecomunicaciones B2B",
  description: "Especialistas en telecomunicaciones corporativas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      {/* Combinamos la fuente Inter con el antialiased para máxima nitidez */}
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}