"use client"
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { enviarInformacao, buscarDetalhesPessoa } from "../services/api";
import { useModal } from "./ModalContext";

interface EnviarInformacoesModalProps {
    id: string;
    paginaAtual?: number;
}

export default function EnviarInformacoesModal({ id, paginaAtual }: EnviarInformacoesModalProps) {
    const { closeModal } = useModal();
    const [informacao, setInformacao] = useState("");
    const [descricao, setDescricao] = useState("");
    const [local, setLocal] = useState("");
    const [data, setData] = useState("");
    const [foto, setFoto] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [mensagem, setMensagem] = useState<string | null>(null);
    const [anexosBase64, setAnexosBase64] = useState<string[]>([]);
    const [ocoId, setOcoId] = useState<number | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [formValido, setFormValido] = useState(false);

    useEffect(() => {
        if (id) {
            buscarDetalhesPessoa(id)
                .then((res) => {
                    setOcoId(res.data?.ultimaOcorrencia?.ocoId ?? null);
                })
                .catch((err) => {
                    console.error("Erro ao buscar dados:", err);
                });
        }
    }, [id]);

    useEffect(() => {
        const infoValida = informacao.trim().length >= 10;
        const descValida = descricao.trim().length >= 10;
        const dataValida = data.trim().length > 0;

        setFormValido(infoValida && descValida && dataValida);
    }, [informacao, descricao, data]);

    const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFoto(file);
            setPreview(URL.createObjectURL(file));

            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    const base64 = (reader.result as string).split(",")[1];
                    setAnexosBase64([base64]);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setCarregando(true);

        if (!ocoId) {
            setMensagem("Ocorreu um erro ao carregar os dados da ocorrência.");
            setCarregando(false);
            return;
        }

        if (informacao.trim().length < 10 || !descricao || !data) {
            setMensagem("Preencha todos os campos obrigatórios corretamente.");
            setCarregando(false);
            return;
        }

        const formData = new FormData();
        formData.append("informacao", informacao);
        formData.append("descricao", descricao);
        formData.append("data", data);
        formData.append("ocoId", ocoId.toString());

        anexosBase64.forEach((base64, i) => {
            formData.append(`anexos[${i}]`, base64);
        });

        try {
            await enviarInformacao(formData);
            setMensagem("Informações enviadas com sucesso!");
            setTimeout(() => {
                closeModal();
            }, 3000);
        } catch (error) {
            console.error(error);
            setMensagem("Erro ao enviar as informações.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Título */}
            <div className="flex-shrink-0 p-4 md:p-6 pb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center md:text-left">
                    Enviar Informações sobre a Pessoa
                </h1>
            </div>

            {/* Conteúdo com scroll */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-4 md:pb-6">
                {/* Mensagens de status */}
                {mensagem == "Informações enviadas com sucesso!" && (
                    <div className="mb-4 p-4 bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-100 rounded-lg border border-green-300 dark:border-green-600">
                        <div className="flex items-center">
                            <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                            {mensagem}
                        </div>
                    </div>
                )}
                {mensagem == "Erro ao enviar as informações." && (
                    <div className="mb-4 p-4 bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-100 rounded-lg border border-red-300 dark:border-red-600">
                        <div className="flex items-center">
                            <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                            {mensagem}
                        </div>
                    </div>
                )}
                {carregando && (
                    <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 rounded-lg border border-yellow-300 dark:border-yellow-600 text-center">
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                            Enviando informações... aguarde
                        </div>
                    </div>
                )}

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <div className="space-y-6">
                            <div>
                                <label className="block font-semibold mb-2 text-gray-900 dark:text-white" htmlFor="informacao">
                                    Informação *
                                </label>
                                <textarea
                                    id="informacao"
                                    value={informacao}
                                    onChange={(e) => setInformacao(e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="Descreva as informações que você tem sobre esta pessoa..."
                                    rows={4}
                                    required
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Mínimo 10 caracteres ({informacao.length}/10)
                                </p>
                            </div>

                            <div>
                                <label className="block font-semibold mb-2 text-gray-900 dark:text-white" htmlFor="descricao">
                                    Descrição do Anexo *
                                </label>
                                <input
                                    type="text"
                                    id="descricao"
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="Informe a descrição do anexo..."
                                    required
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Mínimo 10 caracteres ({descricao.length}/10)
                                </p>
                            </div>

                            <div>
                                <label className="block font-semibold mb-2 text-gray-900 dark:text-white" htmlFor="data">
                                    Data da Ocorrência *
                                </label>
                                <input
                                    type="date"
                                    id="data"
                                    value={data}
                                    onChange={(e) => setData(e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-2 text-gray-900 dark:text-white">
                                    Enviar Fotografia (opcional)
                                </label>
                                <div className="space-y-4">
                                    <label
                                        htmlFor="foto"
                                        className="inline-block px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer transition font-medium"
                                    >
                                        📷 Selecionar Imagem
                                    </label>
                                    <input
                                        type="file"
                                        id="foto"
                                        accept="image/*"
                                        onChange={handleFotoChange}
                                        className="hidden"
                                    />

                                    {preview && (
                                        <div className="mt-4 flex flex-col items-center">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Pré-visualização:</h3>
                                            <div className="relative">
                                                <img
                                                    src={preview}
                                                    alt="Preview da foto"
                                                    className="w-48 h-48 object-cover border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFoto(null);
                                                        setPreview(null);
                                                        setAnexosBase64([]);
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={!formValido || carregando}
                                    className={`w-full px-6 py-3 rounded-lg font-medium transition ${
                                        formValido && !carregando
                                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                                            : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                    }`}
                                >
                                    {carregando ? "Enviando..." : "Enviar Informações"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
