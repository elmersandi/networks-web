import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

// =====================================================================
// TÍTULO: 1. LEER PRODUCTOS (MÉTODO GET)
// =====================================================================
export async function GET() {
  try {
    const productos = await prisma.producto.findMany({
      include: { categoria: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(productos);
  } catch (error) {
    console.error("Error en GET /productos:", error);
    return NextResponse.json({ error: "Error al obtener la lista de productos." }, { status: 500 });
  }
}

// =====================================================================
// TÍTULO: 2. CREAR UN NUEVO PRODUCTO (MÉTODO POST)
// =====================================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const stock = Number(body.stock);
    const precio = Number(body.precio);

    if (!body.sku || !body.nombre || !body.slug || !body.descripcion || !body.categoriaId) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: SKU, Nombre, Descripción o Categoría." },
        { status: 400 }
      );
    }

    if (Number.isNaN(stock) || Number.isNaN(precio)) {
      return NextResponse.json(
        { error: "Los campos Stock y Precio deben ser valores numéricos." },
        { status: 400 }
      );
    }

    const nuevoProducto = await prisma.producto.create({
      data: {
        sku: String(body.sku),
        nombre: String(body.nombre),
        slug: String(body.slug),
        descripcion: String(body.descripcion),
        marca: body.marca ?? null,
        precio: precio,
        stock: stock,
        categoriaId: String(body.categoriaId),
        modelo: body.modelo ?? null,
        imagenPrincipal: body.imagenPrincipal ?? null,
        // ¡AQUÍ ESTÁ LA MAGIA! Guardamos el array de la galería:
        galeria: Array.isArray(body.galeria) ? body.galeria : [],
        isActivo: typeof body.isActivo === "boolean" ? body.isActivo : true,
      }
    });
    
    return NextResponse.json(nuevoProducto);
  } catch (error) {
    console.error("Error en POST /productos:", error);
    const prismaError = error as { code?: string };
    
    if (prismaError.code === 'P2002') {
      return NextResponse.json({ error: "Ese SKU (Código único) o el Slug ya está registrado en otro producto." }, { status: 400 });
    }
    return NextResponse.json({ error: "Error interno al crear el producto." }, { status: 500 });
  }
}

// =====================================================================
// TÍTULO: 3. ACTUALIZAR UN PRODUCTO EXISTENTE (MÉTODO PUT)
// =====================================================================
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');
    const body = await request.json();

    if (!id) id = body.id;

    if (!id) {
      return NextResponse.json({ error: "Falta el ID del producto a actualizar." }, { status: 400 });
    }

    const stock = Number(body.stock);
    const precio = Number(body.precio);

    const productoActualizado = await prisma.producto.update({
      where: { id: id },
      data: {
        sku: String(body.sku),
        nombre: String(body.nombre),
        slug: String(body.slug),
        descripcion: String(body.descripcion),
        marca: body.marca ?? null,
        precio: Number.isNaN(precio) ? undefined : precio,
        stock: Number.isNaN(stock) ? undefined : stock,
        categoriaId: String(body.categoriaId),
        modelo: body.modelo ?? null,
        imagenPrincipal: body.imagenPrincipal ?? null,
        // ¡AQUÍ TAMBIÉN! Actualizamos la galería:
        galeria: Array.isArray(body.galeria) ? body.galeria : [],
        isActivo: typeof body.isActivo === "boolean" ? body.isActivo : true,
      }
    });

    return NextResponse.json(productoActualizado);
  } catch (error) {
    console.error("Error en PUT /productos:", error);
    const prismaError = error as { code?: string };
    
    if (prismaError.code === 'P2002') {
      return NextResponse.json({ error: "El nuevo SKU o Slug que intentas asignar ya le pertenece a otro producto." }, { status: 400 });
    }
    return NextResponse.json({ error: "Error interno al actualizar el producto." }, { status: 500 });
  }
}

// =====================================================================
// TÍTULO: 4. ELIMINAR UN PRODUCTO (MÉTODO DELETE)
// =====================================================================
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: "Falta el ID del producto a eliminar." }, { status: 400 });
    }

    await prisma.producto.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: "Producto eliminado con éxito del sistema." });
  } catch (error) {
    console.error("Error en DELETE /productos:", error);
    const prismaError = error as { code?: string };
    
    if (prismaError.code === 'P2003') {
      return NextResponse.json({ error: "No se puede eliminar porque este producto está enlazado a otras operaciones (Pedidos, etc)." }, { status: 400 });
    }
    return NextResponse.json({ error: "Error interno al intentar eliminar el producto." }, { status: 500 });
  }
}