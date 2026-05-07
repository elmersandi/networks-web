import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { enviarCorreoNotificacion } from "@/src/lib/resend";

// BLOQUE 1: METODO GET - GENERADOR DE PRUEBA OMNICANAL
// Busca al usuario, crea la alerta en BD, verifica sus preferencias 
// y dispara correos externos si el usuario dio permiso.
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const user = await prisma.usuario.findUnique({
      where: { email: session.user.email }
    });

    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    const tituloPrueba = "Cotización de Infraestructura Red";
    const mensajePrueba = "El cliente SENATI ha solicitado cotización de cableado estructurado para el laboratorio 6. Revisa el prospecto en el panel.";

    // 1. Guardar en Base de Datos (Para la Campanita)
    const nuevaNotificacion = await prisma.notificacion.create({
      data: {
        usuarioId: user.id,
        titulo: tituloPrueba,
        mensaje: mensajePrueba,
        tipo: "COTIZACION",
        enlace: "/admin/prospectos",
        leido: false 
      }
    });

    // 2. Verificar preferencias de usuario y enviar Email via Resend
    let correoEnviado = false;
    let mensajeResend = "Correo no enviado porque el usuario tiene la opción apagada.";

    if (user.recibirEmail) {
      const resendResult = await enviarCorreoNotificacion(user.email, tituloPrueba, mensajePrueba);
      if (resendResult.success) {
        correoEnviado = true;
        mensajeResend = "Correo enviado exitosamente a " + user.email;
      } else {
        mensajeResend = "Error de Resend al intentar enviar.";
      }
    }

    return NextResponse.json({ 
      success: true, 
      estado_campanita: "Actualizada",
      estado_correo: mensajeResend,
      data: nuevaNotificacion 
    });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear la notificación de prueba" }, { status: 500 });
  }
}