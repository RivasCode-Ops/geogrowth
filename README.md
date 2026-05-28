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

Abra [http://localhost:5173](http://localhost:5173).

```bash
npm run typecheck   # verificação de tipos
npm run build       # build de produção
npm run preview     # preview do build
```

## PWA e backup

- Após `npm run build`, o service worker é gerado em `dist/` (Workbox).
- **Backup JSON**: botão em **Loja** exporta todas as tabelas IndexedDB.
- Ícones PWA placeholder em `public/icons/` (substitua em produção).

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
