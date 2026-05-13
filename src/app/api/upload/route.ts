// =====================================================================
// TÍTULO: API DE SUBIDA A CLOUDINARY (SIN ANY)
// Archivo: src/app/api/upload/route.ts
// =====================================================================
import { NextResponse } from 'next/server';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Configuramos Cloudinary con las variables de tu archivo .env
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    // Le decimos a TS que esto es un archivo
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se envió ningún archivo" }, { status: 400 });
    }

    // Convertimos la imagen a un formato que Cloudinary entienda (Buffer)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tipamos la Promesa para que sepa que devolverá un objeto con 'secure_url'
    const response = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "inventario_b2b" }, // Se guardará en esta carpeta en tu Cloudinary
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error("Error desconocido al subir a Cloudinary"));
          }
        }
      ).end(buffer);
    });

    // Ahora TS sabe perfectamente qué es "response.secure_url" sin usar "any"
    return NextResponse.json({ url: response.secure_url });
  } catch (error) {
    console.error("Error Upload:", error);
    return NextResponse.json({ error: "Error al subir a Cloudinary" }, { status: 500 });
  }
}