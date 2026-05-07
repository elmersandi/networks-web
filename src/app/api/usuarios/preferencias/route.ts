import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { temaOscuro } = await request.json();

    const usuarioActualizado = await prisma.usuario.update({
      where: { email: session.user?.email as string },
      data: { temaOscuro }
    });

    return NextResponse.json(usuarioActualizado);
  } catch (error) {
    return NextResponse.json({ error: "Error al guardar preferencia" }, { status: 500 });
  }
}