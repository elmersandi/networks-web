// Archivo: src/app/api/dashboard/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function GET() {
  try {
    const [totalEquipos, totalServicios, prospectosNuevos, ultimosProspectos] = await Promise.all([
      prisma.producto.count(),
      prisma.servicio.count(),
      prisma.prospecto.count({ where: { estado: 'NUEVO' } }),
      prisma.prospecto.findMany({ 
        take: 5, 
        orderBy: { createdAt: 'desc' } 
      })
    ]);

    return NextResponse.json({ 
      totalEquipos, 
      totalServicios, 
      prospectosNuevos, 
      ultimosProspectos 
    });
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar el dashboard" }, { status: 500 });
  }
}