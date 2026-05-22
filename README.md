# FinControl IA

Sistema web de gestao financeira pessoal com Next.js, Supabase Auth/PostgreSQL, Tailwind CSS, IA via OpenRouter, rotina de backup para Google Drive, exportacao Power BI e Docker.

## Recursos

- Login, cadastro, logout e recuperacao de senha com Supabase Auth.
- Rotas privadas protegidas por middleware e validacao de sessao.
- RLS no Supabase: cada usuario acessa apenas seus proprios dados.
- Dashboard executivo com saldo, gastos, entradas, valor guardado, metas, graficos e resumo de IA.
- CRUD manual para gastos, entradas, valores guardados e metas.
- Relatorios com CSV mensal e estrutura para PDF/Excel trimestral.
- IA Financeira preparada para OpenRouter com fallback local quando a chave nao existe.
- Historico de backups e area Power BI.
- Dockerfile, docker-compose e configuracao pronta para Vercel.

## Rodar localmente

```bash
npm install
cp .env.example .env
npm run dev
```

Ou com Docker:

```bash
docker compose up --build
```

Acesse `http://localhost:3000`.

## Supabase

1. Crie um projeto no Supabase.
2. Em SQL Editor, execute `supabase/schema.sql`.
3. Copie `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Copie `SUPABASE_SERVICE_ROLE_KEY` apenas para ambientes server-side, nunca no browser.
5. Em Authentication, habilite e-mail/senha e configure a URL do site.

## OpenRouter

Configure:

```env
OPENROUTER_API_KEY=
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free
```

A tela IA Financeira envia apenas o resumo e registros do usuario autenticado para a rota server-side `/api/ai`.

## Google Drive API

1. Crie uma service account no Google Cloud.
2. Habilite Google Drive API.
3. Compartilhe a pasta raiz do Drive com o e-mail da service account.
4. Configure `GOOGLE_DRIVE_CLIENT_EMAIL`, `GOOGLE_DRIVE_PRIVATE_KEY` e, se desejar, `GOOGLE_DRIVE_ROOT_FOLDER_ID`.

A rotina protegida fica em:

```bash
POST /api/backups/run
Header: x-cron-secret: valor-de-CRON_SECRET
```

Fluxo implementado: buscar dados antigos, gerar CSV/JSON e conteudo de relatorio, enviar ao Drive, confirmar, registrar em `backups` e entao apagar os dados antigos. Se o upload/registro falhar, a limpeza nao ocorre.

## Power BI

Use `/api/reports/monthly` para baixar CSV atual ou os links de backup quando existirem. No Power BI Desktop: Obter Dados > Texto/CSV ou Excel. Para operacao recorrente, sincronize a pasta do Google Drive e aponte o Power BI para essa pasta.

## Deploy na Vercel

1. Envie o projeto para um repositorio Git.
2. Importe na Vercel.
3. Configure as variaveis do `.env.example`.
4. Ajuste `NEXT_PUBLIC_APP_URL` para a URL final.
5. Configure um Cron externo, Supabase Cron ou Vercel Cron chamando `/api/backups/run` com `x-cron-secret`.

## Integracao bancaria futura

O MVP usa cadastro manual. A arquitetura separa backend em rotas server-side, permitindo adicionar Open Finance, Pluggy ou Belvo sem expor credenciais ao cliente.
