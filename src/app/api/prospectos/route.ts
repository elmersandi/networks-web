import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

// =====================================================================
// TÍTULO: 1. LEER PROSPECTOS (MÉTODO GET)
// SUBTÍTULO: Devuelve todos los leads/cotizaciones ordenados por el más reciente
// =====================================================================
export async function GET() {
  try {
    const prospectos = await prisma.prospecto.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(prospectos);
  } catch (error) {
    console.error("Error en GET /prospectos:", error);
    return NextResponse.json({ error: "Error al obtener la lista de prospectos." }, { status: 500 });
  }
}

// =====================================================================
// TÍTULO: 2. CREAR UN NUEVO PROSPECTO (MÉTODO POST)
// SUBTÍTULO: Recibe los datos manuales o desde el formulario de la web
// =====================================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.nombre || !body.email || !body.telefono || !body.requerimiento) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: Nombre, Email, Teléfono o Requerimiento." },
        { status: 400 }
      );
    }

    const nuevoProspecto = await prisma.prospecto.create({
      data: {
        nombre: String(body.nombre),
        empresa: body.empresa ?? null,
        ruc: body.ruc ?? null,
        email: String(body.email),
        telefono: String(body.telefono),
        requerimiento: String(body.requerimiento),
        mensaje: body.mensaje ?? null,
        estado: body.estado ?? 'NUEVO', // Por defecto entra como NUEVO
      }
    });
    
    return NextResponse.json(nuevoProspecto);
  } catch (error) {
    console.error("Error en POST /prospectos:", error);
    return NextResponse.json({ error: "Error interno al crear el prospecto." }, { status: 500 });
  }
}

// =====================================================================
// TÍTULO: 3. ACTUALIZAR UN PROSPECTO EXISTENTE (MÉTODO PUT)
// SUBTÍTULO: Actualiza los datos de contacto y el estado de la venta
// =====================================================================
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');
    const body = await request.json();

    if (!id) id = body.id;

    if (!id) {
      return NextResponse.json({ error: "Falta el ID del prospecto a actualizar." }, { status: 400 });
    }

    const prospectoActualizado = await prisma.prospecto.update({
      where: { id: id },
      data: {
        nombre: String(body.nombre),
        empresa: body.empresa ?? null,
        ruc: body.ruc ?? null,
        email: String(body.email),
        telefono: String(body.telefono),
        requerimiento: String(body.requerimiento),
        mensaje: body.mensaje ?? null,
        estado: body.estado, 
      }
    });

    return NextResponse.json(prospectoActualizado);
  } catch (error) {
    console.error("Error en PUT /prospectos:", error);
    return NextResponse.json({ error: "Error interno al actualizar el prospecto." }, { status: 500 });
  }
}

// =====================================================================
// TÍTULO: 4. ELIMINAR UN PROSPECTO (MÉTODO DELETE)
// SUBTÍTULO: Borra el registro de la base de datos de leads
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
      return NextResponse.json({ error: "Falta el ID del prospecto a eliminar." }, { status: 400 });
    }

    await prisma.prospecto.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: "Prospecto eliminado con éxito del sistema." });
  } catch (error) {
    console.error("Error en DELETE /prospectos:", error);
    return NextResponse.json({ error: "Error interno al intentar eliminar el prospecto." }, { status: 500 });
  }
}