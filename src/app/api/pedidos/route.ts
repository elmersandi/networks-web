import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

// =====================================================================
// TÍTULO: 1. LEER PEDIDOS (MÉTODO GET)
// SUBTÍTULO: Devuelve todos los pedidos ordenados por fecha de creación
// =====================================================================
export async function GET() {
  try {
    const pedidos = await prisma.pedido.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(pedidos);
  } catch (error) {
    console.error("Error en GET /pedidos:", error);
    return NextResponse.json({ error: "Error al obtener la lista de pedidos." }, { status: 500 });
  }
}

// =====================================================================
// TÍTULO: 2. CREAR UN NUEVO PEDIDO (MÉTODO POST)
// SUBTÍTULO: Recibe los datos del cliente, calcula el total y guarda el JSON
// =====================================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.clienteNombre || !body.telefonoWa || !body.detalles) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: Nombre, WhatsApp o Detalles del pedido." },
        { status: 400 }
      );
    }

    const nuevoPedido = await prisma.pedido.create({
      data: {
        clienteNombre: String(body.clienteNombre),
        telefonoWa: String(body.telefonoWa),
        empresa: body.empresa ?? null,
        total: Number(body.total) || 0,
        estado: body.estado ?? 'PENDIENTE',
        // Aseguramos que los detalles se guarden como un JSON válido
        detalles: Array.isArray(body.detalles) ? body.detalles : [],
      }
    });
    
    return NextResponse.json(nuevoPedido);
  } catch (error) {
    console.error("Error en POST /pedidos:", error);
    return NextResponse.json({ error: "Error interno al crear el pedido." }, { status: 500 });
  }
}

// =====================================================================
// TÍTULO: 3. ACTUALIZAR UN PEDIDO EXISTENTE (MÉTODO PUT)
// SUBTÍTULO: Actualiza estado, datos y el array JSON de productos
// =====================================================================
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');
    const body = await request.json();

    if (!id) id = body.id;

    if (!id) {
      return NextResponse.json({ error: "Falta el ID del pedido a actualizar." }, { status: 400 });
    }

    const pedidoActualizado = await prisma.pedido.update({
      where: { id: id },
      data: {
        clienteNombre: String(body.clienteNombre),
        telefonoWa: String(body.telefonoWa),
        empresa: body.empresa ?? null,
        total: Number(body.total) || 0,
        estado: body.estado,
        detalles: Array.isArray(body.detalles) ? body.detalles : [],
      }
    });

    return NextResponse.json(pedidoActualizado);
  } catch (error) {
    console.error("Error en PUT /pedidos:", error);
    return NextResponse.json({ error: "Error interno al actualizar el pedido." }, { status: 500 });
  }
}

// =====================================================================
// TÍTULO: 4. ELIMINAR UN PEDIDO (MÉTODO DELETE)
// SUBTÍTULO: Borra el registro de la base de datos
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
      return NextResponse.json({ error: "Falta el ID del pedido a eliminar." }, { status: 400 });
    }

    await prisma.pedido.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: "Pedido eliminado con éxito del sistema." });
  } catch (error) {
    console.error("Error en DELETE /pedidos:", error);
    return NextResponse.json({ error: "Error interno al intentar eliminar el pedido." }, { status: 500 });
  }
}