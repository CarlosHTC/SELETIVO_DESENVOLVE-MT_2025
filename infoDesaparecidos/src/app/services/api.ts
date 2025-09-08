import axios from "axios";

export const api = axios.create({
  baseURL: "https://abitus-api.geia.vip",
});

export const buscarPessoasDesaparecidas = (pagina: number, filtros: any = {}) =>
  api.get("/v1/pessoas/aberto/filtro", {
    params: {
      pagina,
      quantidade: 10,
      ...filtros,
    },
  });

export const buscarDetalhesPessoa = (id: string | number) =>
  api.get(`/v1/pessoas/${id}`);

export const buscarInformacoesDesaparecido = (ocoId: number) =>
  api.get("/v1/ocorrencias/informacoes-desaparecido", {
    params: { ocorrenciaId: ocoId },
  });

export const enviarInformacao = (formData: FormData) =>
  api.post("/v1/ocorrencias/informacoes-desaparecido", formData);

export const buscarEstatisticas = () =>
  api.get("/v1/pessoas/aberto/estatistico");