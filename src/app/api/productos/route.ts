// Archivo: src/app/api/productos/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma'; // Usamos tu nuevo super cerebro de Prisma

export async function GET() {
  try {
    const productos = await prisma.producto.findMany({
      include: { categoria: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(productos);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion,
        marca: body.marca,
        stock: parseInt(body.stock),
        categoriaId: body.categoriaId,
      }
    });
    return NextResponse.json(nuevoProducto);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
  }
}

// Funcion Eliminar Producto DELETE
export async function DELETE(request: Request) {
  try {
    // Capturamos el ID que nos envían por la URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Falta el ID" }, { status: 400 });
    }

    // Le decimos a Prisma que elimine el producto con ese ID
    await prisma.producto.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: "Equipo eliminado" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}