import { Resend } from 'resend';

// Inicializamos Resend con la clave de tu archivo .env
const resend = new Resend(process.env.RESEND_API_KEY);

// BLOQUE 1: FUNCION REUTILIZABLE PARA ENVIAR CORREOS
// Esta funcion recibe el destinatario, el asunto y el mensaje, 
// y arma una plantilla HTML basica para el correo.
export async function enviarCorreoNotificacion(emailDestino: string, titulo: string, mensaje: string) {
  try {
    const data = await resend.emails.send({
      // IMPORTANTE: En la capa gratuita, Resend solo permite enviar desde esta direccion
      // y solo al correo con el que creaste tu cuenta en Resend.
      from: 'Networks Perú <onboarding@resend.dev>', 
      to: emailDestino,
      subject: titulo,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #2563eb; margin-bottom: 20px;">Networks Perú</h2>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb;">
            <p style="margin-top: 0; font-weight: bold; font-size: 16px;">${titulo}</p>
            <p style="margin-bottom: 0; line-height: 1.5;">${mensaje}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888; text-align: center;">
            Recibes este correo porque tienes activadas las Alertas al Correo en tu panel de administración.
          </p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error enviando correo con Resend:", error);
    return { success: false, error };
  }
}