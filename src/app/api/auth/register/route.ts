import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Fíjate aquí: NO dice "export default", dice "export async function POST"
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dni, nombre, email, telefono, password } = body;

    // 1. Validaciones básicas
    if (!dni || !nombre || !email || !password) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    // 2. Verificar si el DNI o Email ya existen
    const usuarioExiste = await prisma.usuario.findFirst({
      where: {
        OR: [{ email }, { dni }]
      }
    });

    if (usuarioExiste) {
      return NextResponse.json({ error: "El DNI o el Email ya están registrados" }, { status: 400 });
    }

    // 3. ENCRIPTAR CONTRASEÑA
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Crear el usuario en la BD
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        dni,
        nombre,
        email,
        telefono,
        password: hashedPassword,
        rol: "VENDEDOR", 
        estadoAcceso: "PENDIENTE", 
        isVerificado: false 
      }
    });

    return NextResponse.json({ message: "Usuario registrado con éxito." }, { status: 201 });

  } catch (error) {
    console.error("Error en el registro:", error);
    return NextResponse.json({ error: "Error interno del servidor al registrar" }, { status: 500 });
  }
}