## 📊 Informações do Candidato

- **Nome:** Carlos Henrique Teixeira Carneiro
- **CPF:** 70217192130
- **E-mail:** chtcarneiro@gmail.com

# Info Desaparecidos - Sistema de Informações sobre Pessoas Desaparecidas

Sistema web desenvolvido em Next.js para consulta e envio de informações sobre pessoas desaparecidas, com interface responsiva e navegação em formato SPA (Single Page Application).

## 🚀 Execução via Docker (Recomendado)

### Pré-requisitos
- Docker instalado
- Docker Compose instalado

### Execução Rápida
```bash
# Clonar o repositório
git clone https://github.com/CarlosHTC/SELETIVO_DESENVOLVE-MT_2025.git
cd infoDesaparecidos

# Executar com Docker Compose
docker-compose up --build
```

A aplicação estará disponível em: http://localhost:3000

> 📋 **Para usuários Windows**: Consulte o arquivo [DOCKER_WINDOWS.md](./DOCKER_WINDOWS.md) para instruções específicas do Windows.

### Comandos Docker Individuais
```bash
# Construir a imagem
docker build -t info-desaparecidos .

# Executar o container
docker run -p 3000:3000 info-desaparecidos

# Executar em background
docker run -d -p 3000:3000 --name info-desaparecidos-app info-desaparecidos
```

### Gerenciamento do Container
```bash
# Parar o container
docker stop info-desaparecidos-app

# Iniciar o container
docker start info-desaparecidos-app

# Remover o container
docker rm info-desaparecidos-app

# Ver logs
docker logs info-desaparecidos-app

# Acessar o container
docker exec -it info-desaparecidos-app sh
```

## 🛠️ Execução Local (Desenvolvimento)

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn instalado

### Instalação e Execução
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar build de produção
npm start
```

A aplicação estará disponível em: http://localhost:3000

## 📋 Funcionalidades

- **Consulta de Desaparecidos**: Busca e filtros avançados
- **Detalhes Completos**: Informações detalhadas com fotos e dados
- **Envio de Informações**: Formulário para envio de novas informações
- **Interface SPA**: Navegação fluida sem recarregamento de página
- **Design Responsivo**: Adaptável a diferentes tamanhos de tela
- **Modo Escuro**: Suporte completo ao tema escuro

## 🏗️ Arquitetura

- **Frontend**: Next.js 15 com React 19
- **Estilização**: Tailwind CSS 4
- **Animações**: Framer Motion
- **Roteamento**: Pages Router do Next.js
- **Estado**: React Context API
- **Containerização**: Docker com multi-stage build

## 📁 Estrutura do Projeto

```
infoDesaparecidos/
├── src/
│   ├── app/
│   │   ├── components/     # Componentes reutilizáveis
│   │   └── services/       # Serviços de API
│   └── pages/             # Páginas da aplicação
├── public/                # Arquivos estáticos
├── Dockerfile            # Configuração Docker
├── docker-compose.yml    # Orquestração Docker
└── README.md            # Este arquivo
```

## 🔧 Configuração Docker

O projeto utiliza um Dockerfile otimizado com:
- **Multi-stage build** para reduzir tamanho da imagem
- **Usuário não-root** para segurança
- **Health checks** para monitoramento
- **Alpine Linux** para imagem leve

> 📚 **Documentação Docker Completa**: Consulte [DOCKER_SETUP.md](./DOCKER_SETUP.md) para detalhes técnicos da configuração Docker.
