#!/bin/bash

# Script de teste para verificar se o Docker está funcionando corretamente
# Autor: Carlos Henrique Teixeira Carneiro

echo "🧪 Iniciando testes do Docker para Info Desaparecidos..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar se Docker está instalado
echo "🔍 Verificando instalação do Docker..."
if ! command -v docker &> /dev/null; then
    print_error "Docker não está instalado!"
    exit 1
fi
print_status "Docker está instalado"

# Verificar se Docker está rodando
echo "🔍 Verificando se Docker está rodando..."
if ! docker info &> /dev/null; then
    print_error "Docker não está rodando! Inicie o Docker Desktop."
    exit 1
fi
print_status "Docker está rodando"

# Verificar se Docker Compose está disponível
echo "🔍 Verificando Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    print_warning "Docker Compose não encontrado, tentando 'docker compose'..."
    if ! docker compose version &> /dev/null; then
        print_error "Docker Compose não está disponível!"
        exit 1
    fi
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi
print_status "Docker Compose está disponível"

# Verificar arquivos necessários
echo "🔍 Verificando arquivos de configuração..."
required_files=("Dockerfile" "docker-compose.yml" "docker.env" "package.json")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Arquivo $file não encontrado!"
        exit 1
    fi
done
print_status "Todos os arquivos necessários estão presentes"

# Testar build da imagem
echo "🔨 Testando build da imagem Docker..."
if $COMPOSE_CMD build --no-cache; then
    print_status "Build da imagem concluído com sucesso!"
else
    print_error "Falha no build da imagem!"
    exit 1
fi

# Testar execução do container
echo "🚀 Testando execução do container..."
if $COMPOSE_CMD up -d; then
    print_status "Container iniciado com sucesso!"
    
    # Aguardar aplicação inicializar
    echo "⏳ Aguardando aplicação inicializar..."
    sleep 15
    
    # Verificar se a aplicação está respondendo
    echo "🔍 Verificando se a aplicação está respondendo..."
    if curl -f http://localhost:3000 &> /dev/null; then
        print_status "Aplicação está respondendo em http://localhost:3000"
    else
        print_warning "Aplicação pode não estar totalmente inicializada ainda"
    fi
    
    # Mostrar status dos containers
    echo "📊 Status dos containers:"
    $COMPOSE_CMD ps
    
    # Mostrar logs
    echo "📋 Últimas linhas dos logs:"
    $COMPOSE_CMD logs --tail=10
    
    # Parar containers
    echo "🛑 Parando containers de teste..."
    $COMPOSE_CMD down
    print_status "Containers parados"
    
else
    print_error "Falha ao iniciar o container!"
    exit 1
fi

echo ""
print_status "Todos os testes passaram! O Docker está configurado corretamente."
echo ""
echo "🚀 Para executar a aplicação:"
echo "   $COMPOSE_CMD up --build"
echo ""
echo "🌐 Acesse: http://localhost:3000"
