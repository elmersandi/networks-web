// Archivo: src/app/api/productos/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

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
    const stock = Number(body.stock);
    const precio = Number(body.precio);

    if (!body.sku || !body.nombre || !body.descripcion || !body.categoriaId) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: sku, nombre, descripcion, categoriaId" },
        { status: 400 }
      );
    }

    if (Number.isNaN(stock) || Number.isNaN(precio)) {
      return NextResponse.json(
        { error: "Los campos stock y precio deben ser numericos" },
        { status: 400 }
      );
    }

    const nuevoProducto = await prisma.producto.create({
      data: {
        sku: String(body.sku),
        nombre: body.nombre,
        descripcion: body.descripcion,
        marca: body.marca ?? null,
        precio,
        stock,
        categoriaId: body.categoriaId,
        modelo: body.modelo ?? null,
        imagenUrl: body.imagenUrl ?? null,
        isActivo: typeof body.isActivo === "boolean" ? body.isActivo : true,
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