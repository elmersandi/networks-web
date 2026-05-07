import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Falta el correo" }, { status: 400 });
    }

    // 1. Generar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expiraEn = new Date(Date.now() + 15 * 60 * 1000);

    // 2. Guardar en BD
    await prisma.codigoVerificacion.deleteMany({ where: { email } });
    await prisma.codigoVerificacion.create({
      data: { email, codigo, expiraEn }
    });

    // 3. Enviar correo (Fíjate que uso onboarding@resend.dev porque es gratis)
    await resend.emails.send({
      from: 'Networks Perú <onboarding@resend.dev>',
      to: email,
      subject: 'Tu código de seguridad - Networks Perú',
      html: `
        <div style="font-family: sans-serif; max-w: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #0f172a;">Networks Perú</h2>
          <p style="color: #475569;">Hola,</p>
          <p style="color: #475569;">Tu código de verificación es:</p>
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <strong style="font-size: 24px; letter-spacing: 5px; color: #2563eb;">${codigo}</strong>
          </div>
        </div>
      `
    });

    return NextResponse.json({ message: "Código enviado" }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al enviar correo" }, { status: 500 });
  }
}