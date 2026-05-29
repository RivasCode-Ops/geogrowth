# CONTEXT — GeoGrowth

## Estado atual

**MVP local completo** (blocos 1–10) + **design system SaaS** (sidebar grafite, teal, cards, `PageHeader`, formulários padronizados) + barra de status local-first + backup JSON em Loja.

## Workspace

- App: `c:\_PROJETOS\geogrowth`
- Método / prompts: `c:\_PROJETOS\workbench\GeoGrowth-Cursor\`

## Design system (UI)

- Tokens: `src/core/theme/tokens.css`
- Componentes: `src/shared/styles/design-system.css`, `Card`, `KpiCard`, `PageHeader`
- Layout: `AppShell`, `Sidebar`, `AppTopbar` (status online/offline + aviso sem cloud sync)
- Features usam `FeatureToolbar` → `PageHeader` e classes `btn`, `field`, `input`, `form-stack`

## Próximos passos (pós-MVP)

1. Teste instalação PWA em dispositivo (`npm run preview` em http://127.0.0.1:5191 ou deploy estático).
2. Opcional: gerar `icon-192.png` redimensionado (hoje 192 reutiliza o asset 512).
3. Sync cloud / backend (fora do escopo atual).

## Decisões

- Arquitetura feature-based; UI não acessa Dexie (apenas `repository` / `core/backup`).
- `analytics` agrega via repositories (leitura cross-feature documentada).
- Org GitHub: `RivasCode-Ops`.
- Dev: **http://127.0.0.1:5190** (`vite.config.ts` — `host: 127.0.0.1`, `port: 5190`).
