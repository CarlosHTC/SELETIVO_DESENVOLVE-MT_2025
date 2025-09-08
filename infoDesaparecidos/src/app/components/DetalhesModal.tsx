"use client"
import { useEffect, useState } from "react";
import { buscarDetalhesPessoa, buscarInformacoesDesaparecido } from "../services/api";
import ImagemComFallback from "./ImagemComFallBack";
import { useModal } from "./ModalContext";

interface DetalhesPessoa {
  id: number;
  nome: string;
  idade: number;
  sexo: string;
  vivo: boolean;
  urlFoto: string;
  ultimaOcorrencia: {
    dtDesaparecimento: string;
    localDesaparecimentoConcat: string;
    ocoId: number;
    dataLocalizacao: string;
    encontradoVivo: boolean;
    ocorrenciaEntrevDesapDTO: {
      informacao: string;
      vestimentasDesaparecido: string;
    };
    listaCartaz: {
      urlCartaz: string;
      tipoCartaz: string;
    }[];
  };
}

interface InfoEnviada {
  ocoId: number;
  informacao: string;
  data: string;
  id: number;
  anexos: string[];
}

interface DetalhesModalProps {
  id: string;
  paginaAtual?: number;
  onTabChange?: (tab: 'detalhes' | 'enviar') => void;
}

export default function DetalhesModal({ id, paginaAtual, onTabChange }: DetalhesModalProps) {
  const { closeModal } = useModal();
  const [dados, setDados] = useState<DetalhesPessoa | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarInfos, setMostrarInfos] = useState(false);
  const [informacoes, setInformacoes] = useState<InfoEnviada[]>([]);

  const [paginaAtualInformacoes, setPaginaAtualInformacoes] = useState(1);
  const itensPorPagina = 5; // quantidade de registros por página
  const totalPaginas = Math.ceil(informacoes.length / itensPorPagina);

  const informacoesPaginadas = informacoes.slice(
    (paginaAtualInformacoes - 1) * itensPorPagina,
    paginaAtualInformacoes * itensPorPagina
  );

  useEffect(() => {
    const carregarDetalhes = async () => {
      try {
        const res = await buscarDetalhesPessoa(id);
        if (!res.data || !res.data.id) {
          setErro("Pessoa não encontrada.");
        } else {
          setDados(res.data);
          setErro(null);
        }
      } catch (err) {
        console.error("Erro ao buscar pessoa:", err);
        setErro("Ocorreu um erro ao carregar os dados.");
      }
    };

    if (id) carregarDetalhes();
  }, [id]);

  if (!dados) {
    return <div className="p-4">Carregando informações...</div>;
  }

  if (erro) {
    useEffect(() => {
      const timeout = setTimeout(() => {
        closeModal();
      }, 5000);
      return () => clearTimeout(timeout);
    }, [closeModal]);

    return (
      <div className="p-6 text-center">
        <p className="text-red-600 font-semibold text-lg mb-4">
          {erro}
        </p>
        <p className="text-gray-500 mb-6">
          O modal será fechado automaticamente em 5 segundos...
        </p>
        <button
          onClick={closeModal}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Fechar Modal
        </button>
      </div>
    );
  }

  const carregarInformacoesEnviadas = async () => {
    try {
      const res = await buscarInformacoesDesaparecido(dados?.ultimaOcorrencia.ocoId!);
      // Ordena as informações por data decrescente (mais recente primeiro)
      const informacoesOrdenadas = res.data.sort((a: InfoEnviada, b: InfoEnviada) =>
        new Date(b.data).getTime() - new Date(a.data).getTime()
      );
      setInformacoes(informacoesOrdenadas);
      setMostrarInfos(true);
    } catch (err) {
      console.error("Erro ao carregar informações enviadas:", err);
    }
  };

  const {
    nome,
    idade,
    sexo,
    vivo,
    urlFoto,
    ultimaOcorrencia
  } = dados;

   return (
     <div className="h-full flex flex-col">
       {/* Título */}
       <div className="flex-shrink-0 p-4 md:p-6 pb-4">
         <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center md:text-left">
           Detalhes de {nome}
         </h1>
       </div>

       {/* Conteúdo principal com scroll */}
       <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-4 md:pb-6 space-y-6">
        {/* Seção principal */}
        <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          {/* Foto */}
          <div className="relative w-full md:w-64 h-[260px] md:h-[300px] overflow-hidden rounded-lg shadow">
            <ImagemComFallback
              src={urlFoto}
              alt={nome}
              destaqueStatus={vivo ? "Vivo" : "Morto"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Informações */}
          <div className="flex-1 space-y-2 text-gray-900 dark:text-gray-100 text-sm md:text-base">
            <p><span className="font-semibold">Idade:</span> {idade}</p>
            <p><span className="font-semibold">Sexo:</span> {sexo}</p>
            <p><span className="font-semibold">Data do desaparecimento:</span>{" "}
              {new Date(ultimaOcorrencia.dtDesaparecimento).toLocaleDateString("pt-BR")}
            </p>
            <p><span className="font-semibold">Local:</span> {ultimaOcorrencia.localDesaparecimentoConcat}</p>
            <p><span className="font-semibold">Vestimentas:</span> {ultimaOcorrencia.ocorrenciaEntrevDesapDTO?.vestimentasDesaparecido}</p>
            <p><span className="font-semibold">Informações:</span> {ultimaOcorrencia.ocorrenciaEntrevDesapDTO?.informacao}</p>

            {/* Cartazes */}
            {ultimaOcorrencia.listaCartaz?.length > 0 && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2">Cartaz:</h2>
                <div className="flex flex-wrap gap-2">
                  {ultimaOcorrencia.listaCartaz.map((cartaz, i) => (
                    <a
                      key={i}
                      href={cartaz.urlCartaz}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100 hover:underline"
                    >
                      {cartaz.tipoCartaz}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

         {/* Informações adicionais */}
         {dados?.ultimaOcorrencia?.ocoId && (
           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
             <button
               onClick={() => {
                 if (mostrarInfos) {
                   setMostrarInfos(false);
                 } else {
                   carregarInformacoesEnviadas();
                 }
               }}
               className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
             >
               {mostrarInfos ? "Ocultar Informações" : "Mais Informações"}
             </button>

             {mostrarInfos && (
               <div className="mt-4">
                 <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
                   Informações previamente enviadas ({informacoes.length} total)
                 </h2>

                 {informacoes.length > 0 ? (
                   <>
                     {/* Lista de informações com scroll independente */}
                     <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                       {informacoesPaginadas.map((info) => (
                         <div
                           key={info.id}
                           className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 hover:shadow-md transition-shadow"
                         >
                           <div className="flex justify-between items-start mb-2">
                             <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                               {new Date(info.data).toLocaleDateString("pt-BR", {
                                 day: "2-digit",
                                 month: "2-digit",
                                 year: "numeric",
                                 hour: "2-digit",
                                 minute: "2-digit"
                               })}
                             </p>
                             <span className="text-xs text-gray-500 dark:text-gray-400">#{info.id}</span>
                           </div>
                           <p className="text-gray-900 dark:text-gray-100 leading-relaxed text-sm">
                             {info.informacao}
                           </p>
                         </div>
                       ))}
                     </div>

                     {/* Paginação fixa no final */}
                     {totalPaginas > 1 && (
                       <div className="mt-4 flex justify-center items-center gap-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                         <button
                           onClick={() => setPaginaAtualInformacoes((p) => Math.max(p - 1, 1))}
                           disabled={paginaAtualInformacoes === 1}
                           className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                           ← Anterior
                         </button>
                         <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                           Página {paginaAtualInformacoes} de {totalPaginas}
                         </span>
                         <button
                           onClick={() => setPaginaAtualInformacoes((p) => Math.min(p + 1, totalPaginas))}
                           disabled={paginaAtualInformacoes === totalPaginas}
                           className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                           Próxima →
                         </button>
                       </div>
                     )}
                   </>
                 ) : (
                   <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                     Nenhuma informação enviada ainda.
                   </p>
                 )}
               </div>
             )}
           </div>
         )}
      </div>
    </div>
  );
}
