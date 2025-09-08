# 🔧 Correção do Erro TypeScript no Docker

## ❌ Problema Identificado

Durante a execução do comando `docker-compose up --build`, foi retornado o seguinte erro:

```
ERROR [builder 6/6] RUN npm run build
⨯ Failed to load next.config.ts, see more info here https://nextjs.org/docs/messages/next-config-error
[Error: Cannot find module 'typescript']
```

E em runtime:
```
npm ERR! code EACCES
npm ERR! Error: EACCES: permission denied, mkdir '/app/node_modules/@alloc/quick-lru'
```

## 🔍 Análise do Problema

1. **TypeScript Missing**: O Next.js tentava carregar `next.config.ts` mas o TypeScript não estava disponível
2. **Permissões**: O usuário `nextjs` não tinha permissão para instalar dependências em runtime
3. **Dependências**: Apenas dependências de produção estavam sendo instaladas, excluindo TypeScript

## ✅ Solução Implementada

### 1. Ajuste no Dockerfile

**Antes:**
```dockerfile
# Instalar dependências (incluindo devDependencies para build)
RUN npm ci

# Estágio de produção
RUN npm ci --only=production && npm cache clean --force
```

**Depois:**
```dockerfile
# Estágio de build - instalar todas as dependências
RUN npm ci

# Estágio de produção - incluir TypeScript
RUN npm ci --only=production && \
    npm install typescript @types/node @types/react @types/react-dom && \
    npm cache clean --force && \
    chown -R nextjs:nodejs /app/node_modules
```

### 2. Correções Aplicadas

- ✅ **TypeScript Incluído**: Adicionado TypeScript e tipos necessários nas dependências de produção
- ✅ **Permissões Corrigidas**: Ajustadas permissões do diretório `node_modules` para o usuário `nextjs`
- ✅ **Multi-stage Build**: Mantido o build otimizado com dois estágios
- ✅ **Segurança**: Preservado o usuário não-root para execução

## 🚀 Resultado

### Build Bem-sucedido
```bash
[+] Building 70.6s (22/23)
✓ Build concluído com sucesso
✓ Imagem criada: infodesaparecidos-info-desaparecidos
```

### Aplicação Funcionando
```bash
> infoDesaparecidos@0.1.0 start
▲ Next.js 15.5.2
- Local:        http://localhost:3000
- Network:      http://172.20.0.2:3000

✓ Starting...
✓ Ready in 826ms
```

### Teste de Conectividade
```bash
curl http://localhost:3000
# StatusCode: 200
# StatusDescription: OK
```

## 📋 Arquivos Modificados

1. **`Dockerfile`** - Corrigido para incluir TypeScript e ajustar permissões
2. **`DOCKER_SETUP.md`** - Atualizado com seção de solução de problemas

## 🔧 Comandos de Verificação

```bash
# Build da aplicação
docker-compose build --no-cache

# Executar aplicação
docker-compose up -d

# Verificar status
docker-compose ps

# Verificar logs
docker-compose logs --tail=10

# Testar conectividade
curl http://localhost:3000
```

## ✅ Status Final

- ✅ **Build**: Funcionando sem erros
- ✅ **Runtime**: Aplicação iniciando corretamente
- ✅ **TypeScript**: Carregando sem problemas
- ✅ **Permissões**: Configuradas adequadamente
- ✅ **Conectividade**: Aplicação respondendo em http://localhost:3000

A aplicação está agora completamente funcional via Docker! 🎉
