import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

// =====================================================================
// TÍTULO: 1. LEER SERVICIOS (MÉTODO GET)
// SUBTÍTULO: Devuelve todos los servicios ordenados por el más reciente
// =====================================================================
export async function GET() {
  try {
    const servicios = await prisma.servicio.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(servicios);
  } catch (error) {
    console.error("Error en GET /servicios:", error);
    return NextResponse.json({ error: "Error al obtener la lista de servicios." }, { status: 500 });
  }
}

// =====================================================================
// TÍTULO: 2. CREAR UN NUEVO SERVICIO (MÉTODO POST)
// SUBTÍTULO: Recibe los datos y la galería, verificando que el slug sea único
// =====================================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.nombre || !body.slug || !body.descripcion) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: Nombre, Slug o Descripción." },
        { status: 400 }
      );
    }

    const nuevoServicio = await prisma.servicio.create({
      data: {
        nombre: String(body.nombre),
        slug: String(body.slug),
        descripcion: String(body.descripcion),
        portada: body.portada ?? null,
        galeria: Array.isArray(body.galeria) ? body.galeria : [],
        isActivo: typeof body.isActivo === "boolean" ? body.isActivo : true,
      }
    });
    
    return NextResponse.json(nuevoServicio);
  } catch (error) {
    console.error("Error en POST /servicios:", error);
    const prismaError = error as { code?: string };
    
    if (prismaError.code === 'P2002') {
      return NextResponse.json({ error: "Esa URL (Slug) ya está siendo usada por otro servicio." }, { status: 400 });
    }
    return NextResponse.json({ error: "Error interno al crear el servicio." }, { status: 500 });
  }
}

// =====================================================================
// TÍTULO: 3. ACTUALIZAR UN SERVICIO EXISTENTE (MÉTODO PUT)
// SUBTÍTULO: Actualiza los textos, estado y la galería de imágenes
// =====================================================================
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');
    const body = await request.json();

    if (!id) id = body.id;

    if (!id) {
      return NextResponse.json({ error: "Falta el ID del servicio a actualizar." }, { status: 400 });
    }

    const servicioActualizado = await prisma.servicio.update({
      where: { id: id },
      data: {
        nombre: String(body.nombre),
        slug: String(body.slug),
        descripcion: String(body.descripcion),
        portada: body.portada ?? null,
        galeria: Array.isArray(body.galeria) ? body.galeria : [],
        isActivo: typeof body.isActivo === "boolean" ? body.isActivo : true,
      }
    });

    return NextResponse.json(servicioActualizado);
  } catch (error) {
    console.error("Error en PUT /servicios:", error);
    const prismaError = error as { code?: string };
    
    if (prismaError.code === 'P2002') {
      return NextResponse.json({ error: "La nueva URL (Slug) ya le pertenece a otro servicio." }, { status: 400 });
    }
    return NextResponse.json({ error: "Error interno al actualizar el servicio." }, { status: 500 });
  }
}

// =====================================================================
// TÍTULO: 4. ELIMINAR UN SERVICIO (MÉTODO DELETE)
// SUBTÍTULO: Elimina el registro por completo de la base de datos
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
      return NextResponse.json({ error: "Falta el ID del servicio a eliminar." }, { status: 400 });
    }

    await prisma.servicio.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: "Servicio eliminado con éxito del sistema." });
  } catch (error) {
    console.error("Error en DELETE /servicios:", error);
    const prismaError = error as { code?: string };
    
    if (prismaError.code === 'P2003') {
      return NextResponse.json({ error: "No se puede eliminar porque está enlazado a otras operaciones." }, { status: 400 });
    }
    return NextResponse.json({ error: "Error interno al intentar eliminar el servicio." }, { status: 500 });
  }
}