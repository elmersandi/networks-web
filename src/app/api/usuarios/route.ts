import { NextResponse } from "next/server";
import prisma from '@/src/lib/prisma';

// Obtener todos los usuarios
export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(usuarios);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}

// Actualizar estado o rol de un usuario
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, estadoAcceso, rol } = body;

    const usuario = await prisma.usuario.update({
      where: { id },
      data: { estadoAcceso, rol }
    });

    return NextResponse.json(usuario);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 });
  }
}