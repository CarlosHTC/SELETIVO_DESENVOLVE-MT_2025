# 🐳 Execução via Docker no Windows

## Pré-requisitos

1. **Docker Desktop para Windows**
   - Baixe em: https://www.docker.com/products/docker-desktop/
   - Instale e reinicie o computador
   - Verifique se o Docker está rodando (ícone na bandeja do sistema)

2. **Git para Windows** (opcional)
   - Baixe em: https://git-scm.com/download/win

## 🚀 Execução Rápida

### Opção 1: PowerShell/CMD
```powershell
# Navegar para o diretório do projeto
cd C:\caminho\para\infoDesaparecidos

# Executar com Docker Compose
docker-compose up --build
```

### Opção 2: Docker Desktop GUI
1. Abra o Docker Desktop
2. Clique em "Open in Visual Studio Code" ou use o terminal integrado
3. Execute os comandos acima

## 🔧 Comandos Úteis no Windows

### Build e Execução
```powershell
# Construir apenas a imagem
docker build -t info-desaparecidos .

# Executar container
docker run -p 3000:3000 info-desaparecidos

# Executar em background
docker run -d -p 3000:3000 --name info-desaparecidos-app info-desaparecidos
```

### Gerenciamento
```powershell
# Ver containers rodando
docker ps

# Parar container
docker stop info-desaparecidos-app

# Iniciar container
docker start info-desaparecidos-app

# Remover container
docker rm info-desaparecidos-app

# Ver logs
docker logs info-desaparecidos-app

# Acessar container
docker exec -it info-desaparecidos-app sh
```

### Docker Compose
```powershell
# Executar em background
docker-compose up -d --build

# Parar todos os serviços
docker-compose down

# Ver logs
docker-compose logs -f

# Ver status
docker-compose ps

# Reconstruir sem cache
docker-compose build --no-cache
```

## 🐛 Solução de Problemas

### Erro: "Docker is not running"
- Verifique se o Docker Desktop está iniciado
- Reinicie o Docker Desktop
- Verifique se a virtualização está habilitada no BIOS

### Erro: "Port 3000 is already in use"
```powershell
# Verificar o que está usando a porta 3000
netstat -ano | findstr :3000

# Parar processo (substitua PID pelo número encontrado)
taskkill /PID <PID> /F
```

### Erro: "Build failed"
```powershell
# Limpar cache do Docker
docker system prune -a

# Reconstruir sem cache
docker-compose build --no-cache
```

## 📁 Estrutura de Arquivos Docker

```
infoDesaparecidos/
├── Dockerfile              # Configuração da imagem
├── docker-compose.yml      # Orquestração dos serviços
├── docker.env             # Variáveis de ambiente
├── .dockerignore          # Arquivos ignorados no build
└── build-docker.sh        # Script de build (Linux/Mac)
```

## 🌐 Acesso à Aplicação

Após executar com sucesso:
- **URL**: http://localhost:3000
- **Status**: Verifique no Docker Desktop ou execute `docker-compose ps`

## 📊 Monitoramento

### Docker Desktop
- Use a interface gráfica para monitorar containers
- Visualize logs em tempo real
- Gerencie recursos e performance

### Linha de Comando
```powershell
# Estatísticas de uso
docker stats

# Informações do sistema
docker system df

# Limpeza de recursos não utilizados
docker system prune
```

## 🔒 Segurança

O Dockerfile está configurado com:
- Usuário não-root para execução
- Imagem Alpine Linux (leve e segura)
- Health checks para monitoramento
- Multi-stage build para otimização
