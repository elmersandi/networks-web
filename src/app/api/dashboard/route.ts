import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

// =====================================================================
// TÍTULO: 1. CONSOLIDADO DE ESTADÍSTICAS (MÉTODO GET)
// SUBTÍTULO: Agrupa conteos de todas las tablas y los últimos prospectos
// =====================================================================
export async function GET() {
  try {
    // Usamos Promise.all para que todas las consultas se ejecuten en paralelo (más rápido)
    const [productos, servicios, prospectos, pedidos, ultimosProspectos] = await Promise.all([
      prisma.producto.count(),
      prisma.servicio.count(),
      prisma.prospecto.count(),
      prisma.pedido.count(),
      // Traemos los 5 prospectos más recientes para la tabla del fondo
      prisma.prospecto.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return NextResponse.json({
      counts: {
        productos,
        servicios,
        prospectos,
        pedidos
      },
      ultimosProspectos
    });
  } catch (error) {
    console.error("Error Dashboard Stats:", error);
    return NextResponse.json({ error: "Error al cargar estadísticas" }, { status: 500 });
  }
}