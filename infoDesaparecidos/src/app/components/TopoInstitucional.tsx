"use client"
import { useEffect, useState } from "react";
import logo from "../assets/logo-pjc.png";
import { useFiltro } from "./FiltroContext";
import { buscarEstatisticas } from "../services/api";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function TopoInstitucional() {
    const router = useRouter();
    const pathname = usePathname();
    const { mostrarFiltros, alternarFiltros } = useFiltro();
    const isHome = pathname === "/";
    const isDetalhes = pathname?.startsWith("/detalhes/");
    const isEnviar = pathname?.startsWith("/enviar-informacoes/");
    const mostrarBotoes = isDetalhes || isEnviar;
    const [estatisticas, setEstatisticas] = useState<{ quantPessoasDesaparecidas: number; quantPessoasEncontradas: number } | null>(null);

    const [dark, setDark] = useState(false);

    useEffect(() => {
        // Só roda no cliente
        const theme = localStorage.getItem("theme");
        setDark(theme === "dark");
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        if (dark) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [dark]);

    useEffect(() => {
        const carregarEstatisticas = async () => {
            try {
                const res = await buscarEstatisticas();
                setEstatisticas(res.data);
            } catch (err) {
                console.error("Erro ao carregar estatísticas:", err);
            }
        };

        carregarEstatisticas();
    }, []);

    return (
        <header className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow">
            <div className="w-full border-b border-gray-700 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-28">
                        <img src="assets/logo-pjc.png" alt="PJC" className="h-16" />
                        <div>
                            <h1 className="text-xl font-bold leading-tight text-center">
                                QUADRO DE PESSOAS DESAPARECIDAS - PJC-MT
                            </h1>
                        </div>
                    </div>
                    <div className="text-right mt-4 md:mt-0">
                        <p className="text-lg font-bold">
                            Denuncie: <span className="text-blue-400">197/181</span>
                        </p>
                        <p className="text-sm">3613-6981</p>
                    </div>
                </div>
            </div>

            <nav className="w-full bg-gray-800 border-t border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row justify-end gap-4 text-sm font-semibold">
                    {estatisticas && (
                        <div className="mb-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-center">
                            <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded p-1 shadow">
                                <h2 className="text-xs font-bold">Desaparecidos</h2>
                                <p className="text-1xl">{estatisticas.quantPessoasDesaparecidas}</p>
                            </div>
                            <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded p-1 shadow">
                                <h2 className="text-xs font-bold">Localizados</h2>
                                <p className="text-1xl">{estatisticas.quantPessoasEncontradas}</p>
                            </div>
                        </div>
                    )}

                    {mostrarBotoes && (
                        <>
                            <Link href="/?pagina=1" className="hover:underline text-white">
                                TELA INICIAL
                            </Link>
                            <button
                                onClick={() => router.back()}
                                className="hover:underline text-white"
                            >
                                VOLTAR
                            </button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}