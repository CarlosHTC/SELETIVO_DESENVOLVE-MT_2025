"use client"
import { useEffect } from "react";
import ImagemComFallback from "./ImagemComFallBack";
import { buscarDetalhesPessoa } from "../services/api";
import { useModal } from "./ModalContext";
import ModalTabs from "./ModalTabs";

interface Props {
  id: number;
  nome: string;
  foto: string;
  situacao: string;
  dataDesaparecimento: string;
  dataLocalizado: string;
  paginaAtual: number;
  situacaoAtualVivoMorto: boolean
}

export default function CardDesaparecido({
  id,
  nome,
  foto,
  situacao,
  dataDesaparecimento,
  dataLocalizado,
  paginaAtual,
  situacaoAtualVivoMorto
}: Props) {
  const { openModal } = useModal();

  useEffect(() => {
    if (id) {
      buscarDetalhesPessoa(id)
        .then((res) => {
        })
        .catch((err) => {
          console.error("Erro ao buscar dados:", err);
        });
    }
  }, [id]);

  const handleCardClick = () => {
    // Abre o modal diretamente com as abas
    openModal(
      <ModalTabs
        id={id.toString()}
        paginaAtual={paginaAtual}
      />,
      `Informações - ${nome}`
    );
  };

  return (
    <div
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
      onClick={handleCardClick}
    >
      <div className="relative w-full h-52 overflow-hidden">
        <ImagemComFallback
          src={foto}
          alt={nome}
          destaqueStatus={situacaoAtualVivoMorto ? "Vivo" : "Morto"}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between text-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-1">
            {nome}
          </h2>
          {situacao === "DESAPARECIDO" && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Desaparecido desde:</span>{" "}
              {new Date(dataDesaparecimento).toLocaleDateString("pt-BR")}
            </p>
          )}
          {/* {situacao === "LOCALIZADO" && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Localizado em:</span>{" "}
              {new Date(dataLocalizado).toLocaleDateString("pt-BR")}
            </p>
          )} */}
        </div>

        <span
          className={`mt-6 inline-block px-6 py-2 text-sm font-bold uppercase tracking-wide rounded-full shadow-sm
            ${situacao === "DESAPARECIDO"
              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100"
              : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
            }`}
        >
          {situacao}
        </span>
      </div>
    </div>
  );
}
