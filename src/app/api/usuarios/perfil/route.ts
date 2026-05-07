import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// BLOQUE 1: METODO GET - OBTENER LOS DATOS ACTUALES DEL USUARIO
// Esta funcion busca en la base de datos toda la informacion del usuario logueado 
// para enviarla a tu pantalla de perfil cuando la pagina termina de cargar.
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const usuario = await prisma.usuario.findUnique({
      where: { email: session.user.email },
      select: { 
        nombre: true, 
        email: true, 
        telefono: true, 
        bio: true, 
        dni: true, 
        rol: true, 
        temaOscuro: true,
        imagen: true,
        portada: true,
        // Conservamos unicamente la configuracion de notificaciones por correo
        recibirEmail: true
      }
    });

    return NextResponse.json(usuario);
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar perfil" }, { status: 500 });
  }
}

// BLOQUE 2: METODO PATCH - GUARDAR LOS CAMBIOS EN LA BASE DE DATOS
// Esta funcion recibe los datos nuevos desde el formulario (cuando le das al boton actualizar) 
// y procesa la logica para sobreescribir los datos antiguos en la base de datos.
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const body = await request.json();
    
    // Extraemos todos los datos enviados por tu frontend, manteniendo solo el booleano de correo
    const { nombre, telefono, bio, dni, email, imagen, portada, recibirEmail } = body; 

    // Preparamos el objeto con los datos base (los que siempre son texto normal)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const datosActualizar: any = { nombre, telefono, bio };
    
    // Verificaciones condicionales para datos que podrian no venir en ciertas peticiones
    if (dni) datosActualizar.dni = dni;
    if (email) datosActualizar.email = email;

    // Utilizamos "!== undefined" para strings o booleanos. 
    // Es vital para "recibirEmail" porque si enviamos un "false" (apagar interruptor), 
    // un "if" normal lo ignoraria. Con "!== undefined" nos aseguramos de que guarde el false.
    if (imagen !== undefined) datosActualizar.imagen = imagen;
    if (portada !== undefined) datosActualizar.portada = portada;
    if (recibirEmail !== undefined) datosActualizar.recibirEmail = recibirEmail;

    // Ejecutamos la actualizacion real en la tabla Usuario
    const usuarioActualizado = await prisma.usuario.update({
      where: { email: session.user.email },
      data: datosActualizar
    });

    return NextResponse.json({ message: "Perfil actualizado correctamente", usuario: usuarioActualizado });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar perfil" }, { status: 500 });
  }
}