import { NextResponse } from "next/server";
import prisma from '@/src/lib/prisma';

// GET: Traer todos los pedidos
export async function GET() {
  try {
    const pedidos = await prisma.pedido.findMany({
      orderBy: { createdAt: 'desc' } // Los más recientes primero
    });
    return NextResponse.json(pedidos);
  } catch (error) {
    console.error("Error cargando pedidos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// DELETE: Eliminar un pedido
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    await prisma.pedido.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Pedido eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando pedido:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}