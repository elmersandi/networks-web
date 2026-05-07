import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';

// Inicializamos Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { token, nuevaClave } = await request.json();

    const user = await prisma.usuario.findUnique({
      where: { resetToken: token }
    });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return NextResponse.json({ error: 'El enlace de recuperación es inválido o ha expirado.' }, { status: 400 });
    }

    const esMismaClave = await bcrypt.compare(nuevaClave, user.password);
    
    if (esMismaClave) {
      return NextResponse.json({ error: 'La nueva contraseña no puede ser igual a tu contraseña actual por motivos de seguridad.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(nuevaClave, 10);

    await prisma.usuario.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    // ==========================================
    // NUEVO: ENVIAR CORREO DE CONFIRMACIÓN
    // ==========================================
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const loginLink = `${baseUrl}/admin/login`;

    await resend.emails.send({
      from: 'Networks Perú <onboarding@resend.dev>', // Si ya verificaste un dominio, ponlo aquí
      to: user.email,
      subject: 'Contraseña Actualizada Exitosamente - Networks Perú',
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="background-color: #10b981; color: white; padding: 10px 20px; border-radius: 20px; font-weight: bold; font-size: 14px;">✓ Cambio Exitoso</span>
          </div>
          
          <h2 style="color: #0f172a; text-align: center; margin-bottom: 20px;">¡Tu contraseña ha sido actualizada!</h2>
          
          <p style="color: #334155; font-size: 16px;">Hola <strong>${user.nombre}</strong>,</p>
          <p style="color: #334155; font-size: 16px;">Te escribimos para confirmar que la contraseña de tu cuenta corporativa en Networks Perú ha sido cambiada exitosamente.</p>
          <p style="color: #334155; font-size: 16px;">Ya puedes iniciar sesión en el portal administrativo con tus nuevas credenciales.</p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${loginLink}" style="background-color: #0f172a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              Ir al Login
            </a>
          </div>
          
          <p style="color: #dc2626; font-size: 13px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-weight: bold;">
            ⚠️ IMPORTANTE: Si tú no realizaste este cambio, por favor contacta inmediatamente con el administrador del sistema.
          </p>
        </div>
      `
    });

    return NextResponse.json({ message: 'Contraseña actualizada con éxito' }, { status: 200 });

  } catch (error: unknown) {
    console.error('-> ERROR FATAL AL RESTABLECER CLAVE:', error);
    return NextResponse.json({ error: 'Error interno del servidor al procesar la solicitud.' }, { status: 500 });
  }
}