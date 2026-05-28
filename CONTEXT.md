# CONTEXT — GeoGrowth

## Estado atual

**MVP local completo** (blocos 1–10) + pós-revisão: UI shared em todas as páginas, **import/export backup** em Loja.

## Workspace

- App: `c:\_PROJETOS\geogrowth`
- Método / prompts: `c:\_PROJETOS\workbench\GeoGrowth-Cursor\`

## Próximos passos (pós-MVP)

1. Ícones PWA definitivos; teste instalação em dispositivo.
2. Sync cloud / backend (fora do escopo atual).

## Decisões

- Arquitetura feature-based; UI não acessa Dexie.
- `analytics` agrega via repositories (leitura cross-feature documentada).
- Org GitHub: `RivasCode-Ops`.
