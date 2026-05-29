# CONTEXT — GeoGrowth

## Estado atual

**MVP local completo** (blocos 1–10) + design system SaaS + PWA (ícones, teste no celular via `preview:lan`) + CI/Pages configurados.

## Workspace

- App: `c:\_PROJETOS\geogrowth`
- Método / prompts: `c:\_PROJETOS\workbench\GeoGrowth-Cursor\`
- Público (após deploy): https://rivascode-ops.github.io/geogrowth/

## Próximos passos (pós-MVP)

1. Ativar **GitHub Pages** no repositório (Source: GitHub Actions) e validar URL pública + PWA instalável.
2. Passar [TESTE-MANUAL.md](./TESTE-MANUAL.md) completo e marcar checklist.
3. Sync cloud / backend (fora do escopo atual — nova fase de produto).

## Decisões

- Arquitetura feature-based; UI não acessa Dexie (apenas `repository` / `core/backup`).
- `analytics` agrega via repositories (leitura cross-feature documentada).
- Org GitHub: `RivasCode-Ops`.
- Dev local: **http://127.0.0.1:5190** | Preview LAN: **npm run preview:lan**
