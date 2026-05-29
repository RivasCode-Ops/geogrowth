# GeoGrowth

App offline-first para crescimento territorial: loja, empresas, mapa, CRM, visitas, parcerias e analytics.

## Stack

- React 19 + Vite + TypeScript (strict)
- Zustand, Dexie (IndexedDB)
- [Leaflet](https://leafletjs.com/) — mapa em Território (tiles OpenStreetMap quando online)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) — shell PWA + service worker
- Arquitetura feature-based em `src/features/`

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra **http://127.0.0.1:5190** (porta fixa do GeoGrowth — evita conflito com outros projetos Vite na 4173/5173/5174).

```bash
npm run typecheck   # verificação de tipos
npm run build       # build de produção
npm run preview     # preview do build (só neste PC)
npm run preview:lan # preview acessível no celular (mesma Wi-Fi)
```

**Celular (PWA):** rode `npm run build` e depois `npm run preview:lan`. No telefone, abra `http://<IP-do-PC>:5191` (ex.: `http://192.168.0.109:5191`). O Vite mostra o IP em `Network:` no terminal.

## Publicar na web (GitHub Pages)

1. No GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Cada push em `main` dispara o workflow **Deploy GitHub Pages**.
3. URL pública: **https://rivascode-ops.github.io/geogrowth/**

Local (simular Pages):

```bash
npm run preview:pages
```

Abra http://127.0.0.1:5191/geogrowth/

## PWA e backup

- Após `npm run build`, o service worker é gerado em `dist/` (Workbox).
- **Backup JSON**: em **Loja**, exporte ou importe todas as tabelas IndexedDB (import substitui dados locais).
- Favicon SVG em `public/favicon.svg`; ícones PNG em `public/icons/` (substitua em produção).
- Barra superior indica **local-first** e status online/offline (sem sync em nuvem nesta versão).
- Checklist de validação: [TESTE-MANUAL.md](./TESTE-MANUAL.md).

## UI

Design system em `src/shared/styles/design-system.css` e tokens em `src/core/theme/tokens.css`. Paleta grafite + teal, cards e formulários unificados em todas as rotas.

## Estrutura

```text
src/
├── app/          # App, router, providers (Bloco 2+)
├── core/         # db, types, layout, theme
├── features/     # domínios (store, companies, …)
└── shared/       # componentes e hooks reutilizáveis
```

## Método de trabalho (Cursor)

Kit em `c:\_PROJETOS\workbench\GeoGrowth-Cursor\`:

- Regras: `.cursor/rules/`
- Prompts por bloco: `prompts/`
- Checklist: `CHECKLIST-REVISAO.md`

## Repositórios

| Repo | URL |
|------|-----|
| GeoGrowth | https://github.com/RivasCode-Ops/geogrowth |
| Workbench | https://github.com/RivasCode-Ops/workbench |
