import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    const servicios = await prisma.servicio.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(servicios);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nuevo = await prisma.servicio.create({
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion,
      }
    });
    return NextResponse.json(nuevo);
  } catch (error) {
    return NextResponse.json({ error: "Error al crear" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "Falta ID" }, { status: 400 });

    await prisma.servicio.delete({ where: { id } });
    return NextResponse.json({ message: "Eliminado" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}