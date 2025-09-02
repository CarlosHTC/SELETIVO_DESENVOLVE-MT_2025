"use client"
import { useEffect, useState } from "react";
import CardDesaparecido from "./components/CardDesaparecido";
import { useFiltro } from "./components/FiltroContext";
import { useSearchParams } from "next/navigation";
import { buscarPessoasDesaparecidas } from "./services/api";

interface PessoaDesaparecida {
    id: number;
    nome: string;
    idade: number;
    sexo: string;
    vivo: boolean;
    urlFoto: string;
    ultimaOcorrencia: {
        dtDesaparecimento: string;
        localDesaparecimentoConcat: string;
        dataLocalizacao: string,
    };
}

export default function Home() {
  const searchParams = useSearchParams();
    const paginaInicial = Number(searchParams.get("pagina")) || 1;
    const [numeroPagina, setNumeroPagina] = useState(paginaInicial - 1);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [totalElementos, setTotalElementos] = useState(0);
    const itensPorPagina = 10;
    const [lista, setLista] = useState<PessoaDesaparecida[]>([]);
    const { mostrarFiltros, alternarFiltros } = useFiltro();
    const [filtros, setFiltros] = useState({
        nome: "",
        sexo: "",
        faixaIdadeInicial: "",
        faixaIdadeFinal: "",
        status: "DESAPARECIDO"
    });

    useEffect(() => {
        const carregarDesaparecidos = async () => {
            try {
                const res = await buscarPessoasDesaparecidas(numeroPagina, filtros);
                setLista(res.data.content || []);
                setTotalPaginas(res.data.totalPages || 0);
                setTotalElementos(res.data.totalElements || 0);
            } catch (err) {
                console.error("Erro ao carregar desaparecidos:", err);
            }
        };

        carregarDesaparecidos();
    }, [numeroPagina, JSON.stringify(filtros)]);

    useEffect(() => {
        const carregarDesaparecidos = async () => {
            try {
                const res = await buscarPessoasDesaparecidas(0, filtros);
                setLista(res.data.content || []);
                setTotalPaginas(res.data.totalPages || 0);
                setTotalElementos(res.data.totalElements || 0);
            } catch (err) {
                console.error("Erro ao carregar desaparecidos:", err);
            }
        };
        setNumeroPagina(0)
        carregarDesaparecidos();
    }, [JSON.stringify(filtros)]);

    const formatNumber = (value: string) => {
        const numericValue = value.replace(/\D/g, "")
        return numericValue
    }

    useEffect(() => {
        if (filtros) {
            console.log(filtros);
        }
    }, [filtros])

    return (
        <div className="p-4 max-w-7xl mx-auto">
            {mostrarFiltros && (
                <div className="fixed inset-0 z-40 flex items-start justify-center pt-20 backdrop-blur-sm bg-black/30">
                    <div className="bg-white dark:bg-gray-900 rounded shadow-lg w-full max-w-2xl p-6 relative">
                        <h2 className="text-xl font-bold mb-4">Filtros</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <input
                                type="text"
                                placeholder="Nome"
                                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded p-2"
                                value={filtros.nome}
                                onChange={(e) =>
                                    setFiltros((prev) => ({ ...prev, nome: e.target.value }))
                                }
                            />
                            <select
                                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded p-2"
                                value={filtros.sexo}
                                onChange={(e) =>
                                    setFiltros((prev) => ({ ...prev, sexo: e.target.value }))
                                }
                            >
                                <option value="">Sexo</option>
                                <option value="MASCULINO">Masculino</option>
                                <option value="FEMININO">Feminino</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Idade mínima"
                                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded p-2"
                                value={filtros.faixaIdadeInicial}
                                onChange={(e) => {
                                    const idadeInicial = formatNumber(e.target.value)
                                    const filtro = {...filtros, faixaIdadeInicial: idadeInicial}
                                    setFiltros(filtro)
                                }
                                }
                            />
                            <input
                                type="text"
                                placeholder="Idade máxima"
                                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded p-2"
                                value={filtros.faixaIdadeFinal}
                                onChange={(e) => {
                                    const idadeFinal = formatNumber(e.target.value)
                                    const filtro = { ...filtros, faixaIdadeFinal: idadeFinal }
                                    setFiltros(filtro)
                                }}
                            />
                            <select
                                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded p-2"
                                value={filtros.status}
                                onChange={(e) =>
                                    setFiltros((prev) => ({ ...prev, status: e.target.value }))
                                }
                            >
                                {/* <option value="">Status</option> */}
                                <option value="LOCALIZADO">LOCALIZADO</option>
                                <option value="DESAPARECIDO">DESAPARECIDO</option>
                            </select>
                        </div>
                        <div className="mt-6 flex gap-2 flex-wrap">
                            {/* <button
                                onClick={() => setNumeroPagina(0)}
                                className="bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-400 dark:hover:bg-gray-400 disabled:opacity-50 dark:text-white px-4 py-2 transition"
                            >
                                Buscar
                            </button> */}
                            <button
                                onClick={() => {
                                    setFiltros({ nome: "", sexo: "", faixaIdadeInicial: "", faixaIdadeFinal: "", status: "DESAPARECIDO" });
                                    setNumeroPagina(0);
                                }}
                                className="bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-400 dark:hover:bg-gray-400 disabled:opacity-50 dark:text-white px-4 py-2 transition"
                            >
                                Limpar Filtros
                            </button>
                            <button
                                onClick={alternarFiltros}
                                className="ml-auto text-sm text-gray-500 hover:text-red-500"
                            >
                                Fechar Filtros ✕
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className=" dark:text-white px-4 py-3 transition ext-xl font-bold mb-4">
                {filtros.status + "S"}
            </div>
            {lista.length === 0 ? (
                <div className="col-span-full text-center text-gray-500">Carregando dados...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {lista.map((d) => (
                        <CardDesaparecido
                            key={d.id}
                            id={d.id}
                            nome={d.nome}
                            foto={d.urlFoto}
                            situacao={filtros.status}
                            situacaoAtualVivoMorto={d.vivo}
                            dataDesaparecimento={d.ultimaOcorrencia?.dtDesaparecimento ?? ""}
                            paginaAtual={numeroPagina + 1}
                        />
                    ))}
                </div>
            )}

            <div className="mt-6 flex flex-col items-center gap-2">
                <div className="flex justify-center space-x-4">
                    <button
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-400 dark:hover:bg-gray-400 disabled:opacity-50 dark:text-white"
                        disabled={numeroPagina === 0}
                        onClick={() => setNumeroPagina((p) => p - 1)}
                    >
                        Anterior
                    </button>
                    <span className="px-4 py-2 font-semibold text-gray-800 dark:text-white">
                        Página {numeroPagina + 1} de {totalPaginas}
                    </span>
                    <button
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-400 dark:hover:bg-gray-400 disabled:opacity-50 dark:text-white"
                        disabled={numeroPagina + 1 >= totalPaginas}
                        onClick={() => setNumeroPagina((p) => p + 1)}
                    >
                        Próxima
                    </button>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    Exibindo {numeroPagina * itensPorPagina + 1} a {Math.min((numeroPagina + 1) * itensPorPagina, totalElementos)} de {totalElementos} registros
                </div>
            </div>
        </div>
    );
}
