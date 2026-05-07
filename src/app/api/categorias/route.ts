import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

// 1. Función para LEER las categorías (GET)
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
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 });
  }
}

// 2. Función para CREAR una nueva categoría (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const nuevaCategoria = await prisma.categoria.create({
      data: {
        nombre: body.nombre,
        slug: body.slug, // <--- Guardamos el slug real
        descripcion: body.descripcion,
      }
    });
    
    return NextResponse.json(nuevaCategoria);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al crear la categoría" }, { status: 500 });
  }
}