// Archivo: src/components/Logo.tsx

interface LogoProps {
  className?: string;
  textClassName?: string;
}

export default function Logo({ className = "", textClassName = "text-2xl" }: LogoProps) {
  return (
    <div className={`flex items-center gap-1.5 font-extrabold tracking-tight ${className}`}>
      <span className={`text-[#1A73E8] ${textClassName}`}>Networks</span>
      <span className={`text-[#E65C00] ${textClassName}`}>Perú</span>
    </div>
  );
}