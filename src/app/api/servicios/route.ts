import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

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
    if (!body.nombre || !body.slug || !body.descripcion) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: nombre, slug, descripcion" },
        { status: 400 }
      );
    }

    const nuevo = await prisma.servicio.create({
      data: {
        nombre: body.nombre,
        slug: body.slug,
        descripcion: body.descripcion,
        imagenUrl: body.imagenUrl ?? null,
        isActivo: typeof body.isActivo === "boolean" ? body.isActivo : true,
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