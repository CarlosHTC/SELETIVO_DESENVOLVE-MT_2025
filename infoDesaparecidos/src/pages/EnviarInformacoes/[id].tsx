"use client"
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { enviarInformacao, buscarDetalhesPessoa } from "../../app/services/api";
import { useRouter } from "next/router";
import { useModal } from "../../app/components/ModalContext";

export default function EnviarInformacoes() {
    const router = useRouter();
    const { closeModal } = useModal();
    const { id, paginaAtual } = router.query;
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
            buscarDetalhesPessoa(id as string)
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
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4  text-gray-900 dark:text-white ">Enviar Informações sobre a Pessoa</h1>
            {mensagem == "Informações enviadas com sucesso!" && (
                <div className="mb-4 p-2 bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-100 rounded">
                    {mensagem}
                </div>
            )}
            {mensagem == "Erro ao enviar as informações." && (
                <div className="mb-4 p-2 bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-100 rounded">
                    {mensagem}
                </div>
            )}
            {carregando && (
                <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded text-center">
                    Enviando informações... aguarde
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold mb-1  text-gray-900 dark:text-white" htmlFor="informacao">
                        Informação
                    </label>
                    <textarea
                        id="informacao"
                        value={informacao}
                        onChange={(e) => setInformacao(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded p-2"
                        placeholder="Descreva as informações que você tem..."
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold mb-1  text-gray-900 dark:text-white" htmlFor="descricao">
                        Descrição do Anexo
                    </label>
                    <input
                        type="text"
                        id="descricao"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded p-2"
                        placeholder="Informe a descrição..."
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold mb-1  text-gray-900 dark:text-white" htmlFor="data">
                        Data da Ocorrência
                    </label>
                    <input
                        type="date"
                        id="data"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded p-2"
                        required
                    />
                </div>
                <div>
                    <div>
                        <label className="block font-semibold mb-1  text-gray-900 dark:text-white">Enviar Fotografia (opcional)</label>

                        <label
                            htmlFor="foto"
                            className="inline-block px-4 py-2  bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-400 dark:hover:bg-gray-400 dark:text-white cursor-pointer transition"
                        >
                            Selecionar Imagem
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
                                <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Pré-visualização:</h2>
                                <img
                                    src={preview}
                                    alt="Preview da foto"
                                    className="w-48 h-48 object-cover border rounded shadow"
                                />
                            </div>
                        )}
                    </div>
                </div>
                <button
                    type="submit"
                    className="  dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded p-2"
                >
                    Enviar
                </button>
            </form>
        </div>
    );
}
