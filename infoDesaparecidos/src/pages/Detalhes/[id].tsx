"use client"
import { useEffect, useState } from "react";
import { buscarDetalhesPessoa, buscarInformacoesDesaparecido } from "../../app/services/api";
import ImagemComFallback from "../../app/components/ImagemComFallBack";
import { useRouter } from "next/router";
import { useModal } from "../../app/components/ModalContext";

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

export default function Detalhes() {
    const router = useRouter();
    const { closeModal } = useModal();
    const { id, paginaAtual } = router.query;
    const [dados, setDados] = useState<DetalhesPessoa | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [mostrarInfos, setMostrarInfos] = useState(false);
    const [informacoes, setInformacoes] = useState<InfoEnviada[]>([]);

    useEffect(() => {
        const carregarDetalhes = async () => {
            try {
                const res = await buscarDetalhesPessoa(id as string);
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
            setInformacoes(res.data);
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
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-5 gap-4 m-5  text-gray-900 dark:text-white">Detalhes de {nome}</h1>
            <div className="flex flex-col md:flex-row gap-6">
                <ImagemComFallback
                    src={urlFoto}
                    alt={nome}
                    destaqueStatus={vivo == true ? "Vivo" : "Morto"}
                    className="w-full md:w-64 h-[300px] object-cover rounded"
                />

                <div className="flex-1 space-y-2 text-left  text-gray-900 dark:text-white">
                    <p><strong>Idade:</strong> {idade}</p>
                    <p><strong>Sexo:</strong> {sexo}</p>
                    <p>
                        <strong>Situação:</strong>{" "}
                        <span className={`px-2 py-1 rounded text-white  ${vivo ? "bg-green-500" : "bg-red-500"}`}>
                            {vivo ? "Vivo(a)" : "Morto(a)"}
                        </span>
                    </p>
                    <p><strong>Data do desaparecimento:</strong> {new Date(ultimaOcorrencia.dtDesaparecimento).toLocaleDateString("pt-BR")}</p>
                    <p><strong>Local:</strong> {ultimaOcorrencia.localDesaparecimentoConcat}</p>
                    <p><strong>Vestimentas:</strong> {ultimaOcorrencia.ocorrenciaEntrevDesapDTO?.vestimentasDesaparecido}</p>
                    <p><strong>Informações:</strong> {ultimaOcorrencia.ocorrenciaEntrevDesapDTO?.informacao}</p>

                    {ultimaOcorrencia.listaCartaz?.length > 0 && (
                        <div className="mt-4">
                            <h2 className="font-semibold">Cartaz:</h2>
                            {ultimaOcorrencia.listaCartaz.map((cartaz, i) => (
                                <a
                                    key={i}
                                    href={cartaz.urlCartaz}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block underline text-blue-600"
                                >
                                    {cartaz.tipoCartaz}
                                </a>
                            ))}
                        </div>
                    )}
                </div>

            </div>
            {dados?.ultimaOcorrencia?.ocoId && (
                <div className="mt-6">
                    <button
                        onClick={() => {
                            if (mostrarInfos) {
                                setMostrarInfos(false);
                            } else {
                                carregarInformacoesEnviadas();
                            }
                        }}
                        className="w-48 bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-400 dark:hover:bg-gray-400 dark:text-white px-4 py-2 rounded transition w-full md:w-auto"
                    >
                        {mostrarInfos ? "Ocultar Informações" : "Mais Informações"}
                    </button>

                    {mostrarInfos && (
                        <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded shadow space-y-4 ">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                                Informações previamente enviadas
                            </h2>

                            {informacoes.length > 0 ? (
                                informacoes.map((info) => (
                                    <div
                                        key={info.id}
                                        className="border-b border-gray-300 dark:border-gray-600 pb-2 text-left"
                                    >
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            <strong>Data:</strong>{" "}
                                            {new Date(info.data).toLocaleDateString("pt-BR")}
                                        </p>
                                        <p className="text-gray-900 dark:text-white">
                                            <strong>Informação: </strong>
                                            {info.informacao}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-300">
                                    Nenhuma informação enviada ainda.
                                </p>
                            )}
                        </div>
                    )}


                </div>
            )}

            <div className="mt-6">
                {ultimaOcorrencia.encontradoVivo != null ? (
                    <button
                        onClick={() => {
                            router.push({
                                pathname: `/enviar-informacoes/${id}`,
                                query: { paginaAtual }
                            });
                        }}
                        className="inline-block w-48 bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-400 dark:hover:bg-gray-400 dark:text-white px-4 py-2 rounded transition w-full md:w-auto text-center"
                    >
                        Enviar novas Informações
                    </button>
                ) : (
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded text-center shadow w-full md:w-auto">
                        <p className="font-semibold">Agradecemos pela colaboração</p>
                        <p className="text-sm">Esta pessoa já foi localizada.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
