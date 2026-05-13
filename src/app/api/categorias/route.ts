import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma'; // Mantengo tu ruta exacta

// =====================================================================
// TÍTULO: 1. LEER CATEGORÍAS (MÉTODO GET)
// Devuelve todas las categorías ordenadas por fecha y cuenta sus productos
// =====================================================================
export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      include: {
        _count: {
          select: { productos: true } // ¡Esto hace la magia de contar!
        }
      },
      orderBy: { createdAt: 'desc' } 
    });
    return NextResponse.json(categorias);
  } catch (error) {
    console.error("Error en GET /categorias:", error);
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 });
  }
}

// =====================================================================
// TÍTULO: 2. CREAR UNA NUEVA CATEGORÍA (MÉTODO POST)
// Recibe los datos del formulario y la guarda en la base de datos
// =====================================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const nuevaCategoria = await prisma.categoria.create({
      data: {
        nombre: body.nombre,
        slug: body.slug,
        descripcion: body.descripcion,
      }
    });
    
    return NextResponse.json(nuevaCategoria);
  } catch (error) {
    console.error("Error en POST /categorias:", error);
    
    // Le decimos a TypeScript la forma que podría tener el error (Cero 'any')
    const prismaError = error as { code?: string };
    
    // P2002 es el código de Prisma cuando violas una regla "@unique" (ej. Slug repetido)
    if (prismaError.code === 'P2002') {
      return NextResponse.json({ error: "El nombre o el URL (Slug) ya existen." }, { status: 400 });
    }
    return NextResponse.json({ error: "Error interno al crear la categoría" }, { status: 500 });
  }
}

// =====================================================================
// TÍTULO: 3. ACTUALIZAR UNA CATEGORÍA EXISTENTE (MÉTODO PUT)
// Busca la categoría por su ID y sobreescribe sus datos
// =====================================================================
export async function PUT(request: Request) {
  try {
    // 1. Extraemos el ID de la URL (ej: /api/categorias?id=xxxxx)
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');
    
    // 2. Leemos los nuevos datos enviados desde el formulario
    const body = await request.json();

    // 3. Por seguridad, si el ID no vino en la URL, lo buscamos en el Body
    if (!id) id = body.id;

    if (!id) {
      return NextResponse.json({ error: "Falta el ID de la categoría a actualizar." }, { status: 400 });
    }

    // 4. Actualizamos en Prisma
    const categoriaActualizada = await prisma.categoria.update({
      where: { id: id },
      data: {
        nombre: body.nombre,
        slug: body.slug,
        descripcion: body.descripcion,
      }
    });

    return NextResponse.json(categoriaActualizada);
  } catch (error) {
    console.error("Error en PUT /categorias:", error);
    
    const prismaError = error as { code?: string };
    
    if (prismaError.code === 'P2002') {
      return NextResponse.json({ error: "El nuevo nombre o Slug ya le pertenecen a otra categoría." }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al actualizar la categoría" }, { status: 500 });
  }
}

// =====================================================================
// TÍTULO: 4. ELIMINAR UNA CATEGORÍA (MÉTODO DELETE)
// Busca la categoría por su ID y la destruye (Si no tiene productos)
// =====================================================================
export async function DELETE(request: Request) {
  try {
    // 1. Extraemos el ID de la URL que mandó el botón de eliminar
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    // 2. Si no vino en la URL, lo intentamos sacar del cuerpo (Body)
    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: "Falta el ID de la categoría a eliminar." }, { status: 400 });
    }

    // 3. Ejecutamos la eliminación en Prisma
    await prisma.categoria.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: "Categoría eliminada con éxito del sistema." });
  } catch (error) {
    console.error("Error en DELETE /categorias:", error);
    
    const prismaError = error as { code?: string };
    
    // P2003 es el código de Prisma cuando intentas borrar algo que tiene hijos (Productos)
    if (prismaError.code === 'P2003') {
      return NextResponse.json({ error: "No se puede eliminar porque tiene productos registrados dentro." }, { status: 400 });
    }
    return NextResponse.json({ error: "Error interno al intentar eliminar la categoría" }, { status: 500 });
  }
}