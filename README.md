# Nexus API

API REST construída com **NestJS**, **Prisma** e **Redis**, documentada com **Swagger**. Faz parte do ecossistema Nexus, consumida pelo frontend [nexus-app](https://github.com/EliasSantos-dev/nexus-app).

## 🧱 Stack

- **NestJS** — arquitetura modular (módulos, providers, DTOs)
- **Prisma** — ORM e migrations (`/prisma`)
- **Redis** (ioredis) — cache
- **class-validator** / **class-transformer** — validação de entrada
- **Swagger** — documentação interativa da API
- **Jest** — testes unitários e e2e (`/test`)

## ✨ O que tem aqui

- Módulo de **clientes** com DTOs validados
- Camada de **cache** com Redis
- **Documentação** automática da API via Swagger
- **Testes** acompanhando os serviços

## 🚀 Rodando localmente

```bash
npm install
# configure as variáveis de ambiente (ex.: DATABASE_URL, REDIS_URL)
npx prisma migrate dev
npm run start:dev
```

## 📜 Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run start:dev` | Servidor em modo watch |
| `npm run test` | Testes unitários |
| `npm run test:e2e` | Testes end-to-end |
| `npx prisma studio` | Inspecionar o banco |
