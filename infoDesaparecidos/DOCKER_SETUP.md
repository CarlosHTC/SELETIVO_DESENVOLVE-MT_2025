# 🐳 Configuração Docker - Info Desaparecidos

## 📋 Visão Geral

Este projeto está configurado para execução via Docker com as seguintes características:

- **Multi-stage build** para otimização de tamanho
- **Alpine Linux** para imagem leve e segura
- **Usuário não-root** para segurança
- **Health checks** para monitoramento
- **Docker Compose** para orquestração

## 🏗️ Arquitetura Docker

### Dockerfile
```dockerfile
# Estágio 1: Build
FROM node:20-alpine AS builder
# Instala dependências e faz build da aplicação

# Estágio 2: Produção
FROM node:20-alpine AS runner
# Imagem final otimizada apenas com arquivos necessários
```

### Docker Compose
```yaml
services:
  info-desaparecidos:
    build: .
    ports: ["3000:3000"]
    env_file: docker.env
    restart: unless-stopped
    healthcheck: ...
```

## 📁 Arquivos de Configuração

| Arquivo | Descrição |
|---------|-----------|
| `Dockerfile` | Configuração da imagem Docker |
| `docker-compose.yml` | Orquestração dos serviços |
| `docker.env` | Variáveis de ambiente |
| `.dockerignore` | Arquivos ignorados no build |
| `build-docker.sh` | Script de build (Linux/Mac) |
| `DOCKER_WINDOWS.md` | Guia específico para Windows |

## 🔧 Variáveis de Ambiente

### docker.env
```env
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_PUBLIC_APP_NAME=Info Desaparecidos
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 🚀 Comandos de Execução

### Desenvolvimento
```bash
# Build e execução
docker-compose up --build

# Execução em background
docker-compose up -d --build

# Parar serviços
docker-compose down
```

### Produção
```bash
# Build da imagem
docker build -t info-desaparecidos .

# Executar container
docker run -p 3000:3000 info-desaparecidos

# Executar com variáveis de ambiente
docker run -p 3000:3000 --env-file docker.env info-desaparecidos
```

## 📊 Monitoramento

### Health Check
- **Teste**: `wget --quiet --tries=1 --spider http://localhost:3000`
- **Intervalo**: 30 segundos
- **Timeout**: 10 segundos
- **Retries**: 3 tentativas
- **Start Period**: 40 segundos

### Logs
```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f info-desaparecidos

# Ver logs do container
docker logs info-desaparecidos-app
```

## 🔒 Segurança

### Configurações de Segurança
- ✅ Usuário não-root (`nextjs:nodejs`)
- ✅ Imagem Alpine Linux (menor superfície de ataque)
- ✅ Multi-stage build (apenas arquivos necessários)
- ✅ Health checks para monitoramento
- ✅ Restart policy configurada

### Boas Práticas Implementadas
- Dependências de produção apenas
- Arquivos de desenvolvimento excluídos
- Usuário com privilégios mínimos
- Imagem base otimizada

## 🐛 Solução de Problemas

### Build Falha
```bash
# Limpar cache
docker system prune -a

# Rebuild sem cache
docker-compose build --no-cache
```

### Erro de TypeScript
**Problema**: `Cannot find module 'typescript'` ou `EACCES: permission denied`
**Solução**: O Dockerfile já está configurado para incluir TypeScript nas dependências de produção e corrigir permissões.

### Porta em Uso
```bash
# Verificar processos na porta 3000
netstat -tulpn | grep :3000

# Parar container específico
docker stop info-desaparecidos-app
```

### Problemas de Permissão
```bash
# Verificar usuário do container
docker exec -it info-desaparecidos-app whoami

# Verificar permissões
docker exec -it info-desaparecidos-app ls -la /app
```

## 📈 Performance

### Otimizações Implementadas
- **Multi-stage build**: Reduz tamanho da imagem final
- **Alpine Linux**: Imagem base leve (~5MB)
- **Node.js 20**: Versão LTS com melhor performance
- **Dumb-init**: Gerenciamento adequado de processos
- **Health checks**: Monitoramento automático

### Tamanho da Imagem
- **Build stage**: ~500MB (temporário)
- **Final image**: ~150MB (otimizada)
- **Runtime**: ~50MB (apenas dependências necessárias)

## 🔄 CI/CD

### GitHub Actions (Exemplo)
```yaml
name: Build and Deploy
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker image
        run: docker build -t info-desaparecidos .
      - name: Run tests
        run: docker run --rm info-desaparecidos npm test
```

## 📚 Recursos Adicionais

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Next.js Docker Example](https://github.com/vercel/next.js/tree/canary/examples/with-docker)
- [Alpine Linux Security](https://alpinelinux.org/about/)
