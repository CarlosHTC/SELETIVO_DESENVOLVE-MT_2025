#!/bin/bash

# Script para build e execução da aplicação via Docker
# Autor: Carlos Henrique Teixeira Carneiro

echo "🐳 Iniciando build da aplicação Info Desaparecidos..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Remover imagens antigas (opcional)
read -p "🗑️  Deseja remover imagens antigas? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Removendo imagens antigas..."
    docker image prune -f
    docker rmi info-desaparecidos_info-desaparecidos 2>/dev/null || true
fi

# Build da aplicação
echo "🔨 Construindo aplicação..."
docker-compose build --no-cache

# Verificar se o build foi bem-sucedido
if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
    
    # Executar aplicação
    echo "🚀 Iniciando aplicação..."
    docker-compose up -d
    
    # Verificar se a aplicação está rodando
    echo "⏳ Aguardando aplicação inicializar..."
    sleep 10
    
    # Verificar health check
    if docker-compose ps | grep -q "healthy"; then
        echo "✅ Aplicação está rodando e saudável!"
        echo "🌐 Acesse: http://localhost:3000"
    else
        echo "⚠️  Aplicação iniciada, mas health check não passou ainda."
        echo "🌐 Acesse: http://localhost:3000"
    fi
    
    echo ""
    echo "📋 Comandos úteis:"
    echo "   Ver logs: docker-compose logs -f"
    echo "   Parar: docker-compose down"
    echo "   Status: docker-compose ps"
    
else
    echo "❌ Erro no build da aplicação."
    exit 1
fi
