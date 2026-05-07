import { NextResponse } from 'next/server';
import prisma from "@/src/lib/prisma";
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    console.log("1. Recibiendo petición de recuperación...");
    const { email } = await request.json();

    console.log(`2. Buscando usuario en base de datos: ${email}`);
    const user = await prisma.usuario.findUnique({ where: { email } });
    
    if (!user) {
      console.log("-> ERROR: Usuario no encontrado.");
      return NextResponse.json({ error: 'Este correo no está registrado en el sistema.' }, { status: 404 });
    }

    console.log("3. Usuario encontrado. Generando Token de seguridad...");
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora de validez

    console.log("4. Guardando Token en la base de datos...");
    await prisma.usuario.update({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    console.log("5. Intentando enviar el correo por Resend...");
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/admin/restablecer?token=${resetToken}`;

    // AQUÍ ESTÁ LA CLAVE: Capturamos el error de Resend si algo sale mal
    const { data, error } = await resend.emails.send({
      from: 'Networks Perú <onboarding@resend.dev>',
      to: email, // OJO: Con el dominio de prueba, esto SOLO funciona si es tu propio correo
      subject: 'Recuperación de Contraseña - Networks Perú',
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #2563eb; margin-bottom: 20px;">Networks Perú - Portal B2B</h2>
          <p style="color: #334155; font-size: 16px;">Hola <strong>${user.nombre}</strong>,</p>
          <p style="color: #334155; font-size: 16px;">Recibimos una solicitud para restablecer la contraseña de tu cuenta corporativa.</p>
          <p style="color: #334155; font-size: 16px;">Haz clic en el siguiente botón para crear una nueva clave. Este enlace es seguro y expirará en 1 hora.</p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetLink}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              Restablecer mi Contraseña
            </a>
          </div>
          
          <p style="color: #94a3b8; font-size: 13px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
            Si no solicitaste este cambio, puedes ignorar este correo de forma segura. Tu contraseña no cambiará hasta que accedas al enlace y crees una nueva.
          </p>
        </div>
      `
    });

    // Si Resend nos bota un error (como que el correo no está autorizado), lo atrapamos
    if (error) {
      console.error("-> ERROR DE RESEND:", error);
      return NextResponse.json({ error: `Fallo al enviar correo: ${error.message}` }, { status: 400 });
    }

    console.log("6. ¡Correo enviado con éxito!", data);
    return NextResponse.json({ message: 'Correo enviado correctamente' }, { status: 200 });

  } catch (error: unknown) {
    console.error('-> ERROR FATAL EN EL SERVIDOR:', error);
    return NextResponse.json({ error: 'Error interno del servidor al procesar la solicitud.' }, { status: 500 });
  }
}