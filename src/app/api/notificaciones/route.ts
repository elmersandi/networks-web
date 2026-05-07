import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// BLOQUE 1: METODO GET - OBTENER LAS NOTIFICACIONES
// Busca las 10 notificaciones mas recientes asociadas al correo del usuario en sesion.
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const notificaciones = await prisma.notificacion.findMany({
      where: { 
        usuario: { email: session.user.email } 
      },
      orderBy: { createdAt: 'desc' },
      take: 10 // Solo traemos las 10 mas recientes para no saturar la red
    });

    return NextResponse.json(notificaciones);
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar notificaciones" }, { status: 500 });
  }
}

// BLOQUE 2: METODO PATCH - MARCAR TODAS COMO LEIDAS
// Cuando el usuario abre la campanita, llamamos a esta ruta para poner "leido: true" a todas.
export async function PATCH() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    // Primero obtenemos el ID del usuario usando su email
    const user = await prisma.usuario.findUnique({ 
      where: { email: session.user.email },
      select: { id: true }
    });
    
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    // Actualizamos todas sus notificaciones no leidas
    await prisma.notificacion.updateMany({
      where: { 
        usuarioId: user.id,
        leido: false 
      },
      data: { leido: true }
    });

    return NextResponse.json({ message: "Notificaciones marcadas como leidas" });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar notificaciones" }, { status: 500 });
  }
}