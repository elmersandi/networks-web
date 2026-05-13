"use client";

import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Camera, Trash } from "lucide-react"; // Añadimos Camera
import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  hidePreview?: boolean;
  isAvatar?: boolean; // <-- ¡NUEVA PROPIEDAD!
}

export default function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
  hidePreview = false,
  isAvatar = false, // <-- Por defecto es falso (botón grande)
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSuccess = (result: any) => {
    if (result?.info?.secure_url) {
      onChange(result.info.secure_url);
    }
  };

  if (!isMounted) return null;

  return (
    <div>
      {!hidePreview && value.length > 0 && (
        <div className="mb-4 flex items-center gap-4 flex-wrap">
          {value.map((url) => (
            <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden border border-slate-700">
              <div className="z-10 absolute top-2 right-2">
                <button type="button" onClick={() => onRemove(url)} className="bg-[#E02424] p-2 rounded-md text-white hover:bg-red-700 transition-colors">
                  <Trash className="w-4 h-4" />
                </button>
              </div>
              <Image fill className="object-cover" alt="Imagen subida" src={url} />
            </div>
          ))}
        </div>
      )}

      <CldUploadWidget uploadPreset="networks_preset" onSuccess={onSuccess}>
        {({ open }) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const onClick = (e: any) => {
            e.preventDefault();
            try {
              if (open) open();
            } catch (error) {
              console.warn("Cloudinary se está inicializando...", error);
            }
          };

          return (
            <button
              type="button"
              disabled={disabled}
              onClick={onClick}
              // MAGIA AQUÍ: Si es avatar, es un círculo pequeñito. Si no, es el botón normal.
              className={
                isAvatar
                  ? "bg-[#1D4ED8] p-2.5 rounded-full text-white hover:bg-[#1E40AF] transition-colors border-2 border-white dark:border-[#121212] flex items-center justify-center absolute bottom-0 right-0"
                  : "flex items-center gap-2 bg-[#1D4ED8] text-white px-4 py-2 rounded-md hover:bg-[#1E40AF] transition-colors disabled:opacity-50 text-sm"
              }
            >
              {isAvatar ? (
                <Camera className="w-4 h-4" />
              ) : (
                <>
                  <ImagePlus className="w-4 h-4" />
                  Subir Imagen
                </>
              )}
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}