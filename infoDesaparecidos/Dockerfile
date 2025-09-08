# Dockerfile para aplicação Next.js - Info Desaparecidos
# Multi-stage build para otimizar o tamanho da imagem

# Estágio 1: Build da aplicação
FROM node:20.11-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências (incluindo devDependencies para build)
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Estágio 2: Imagem de produção
FROM node:20.11-alpine AS runner

# Instalar dumb-init para gerenciamento de processos
RUN apk add --no-cache dumb-init

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências de produção incluindo TypeScript
COPY package*.json ./
RUN npm ci --only=production && \
    npm install typescript @types/node @types/react @types/react-dom && \
    npm cache clean --force && \
    chown -R nextjs:nodejs /app/node_modules

# Copiar build da aplicação
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./

# Copiar arquivos de configuração
COPY --chown=nextjs:nodejs next.config.ts ./
COPY --chown=nextjs:nodejs tsconfig.json ./
COPY --chown=nextjs:nodejs postcss.config.mjs ./

# Mudar para usuário não-root
USER nextjs

# Expor porta
EXPOSE 3000

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Comando de inicialização
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
