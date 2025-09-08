import { useState, useEffect } from "react";
interface ImagemComFallbackProps {
  src: string;
  alt: string;
  className?: string;
  skeletonClassName?: string;
  destaqueStatus?: "Morto" | "Vivo";
}

export default function ImagemComFallback({
  src,
  alt,
  className = "",
  skeletonClassName = "w-full h-48 bg-gray-200 animate-pulse rounded-t-xl",
  destaqueStatus,
}: ImagemComFallbackProps) {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  // const [situacao, setSituacao] = useState("Desaparecido");

  useEffect(() => {
    if (!src) {
      setErro(true);
      setIsFallback(true);
      setCarregando(false);
    }
  }, [src]);

  const borderColor =
    destaqueStatus === "Morto" ? "border-red-400 " : "border-green-400";
  return (
    <div className={`relative ${borderColor} border-4 rounded`}>
      {carregando && <div className={skeletonClassName} />}

      <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded-full z-10
    ${destaqueStatus === "Morto"
          ? "bg-red-500 text-white"
          : "bg-green-500 text-white"}
  `}>
        {destaqueStatus + "(a)"}
      </span>
      <img
        loading="lazy"
        decoding="async"
        src={!erro && src ? src : "assets/sem-foto.png"}
        alt={alt}
        className={`${className}  transition-opacity duration-500 ${carregando ? "opacity-0" : "opacity-100"
          }`}
        onLoad={() => setCarregando(false)}
        onError={() => {
          setErro(true);
          setIsFallback(true);
          setCarregando(false);
        }}
      />


      {isFallback && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
            Foto não disponível
          </div>
        </div>
      )}
    </div>
  );
}
