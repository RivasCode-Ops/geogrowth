# CONTEXT — GeoGrowth

## Estado atual

**MVP local completo** (blocos 1–9) + **Bloco 10 revisão** — padronização shared (`FeatureAlert`, `FeatureToolbar`, `activeStoreContext`, `mapFeatureError`, `companyScope`, `nowIso` em `core/utils`).

## Workspace

- App: `c:\_PROJETOS\geogrowth`
- Método / prompts: `c:\_PROJETOS\workbench\GeoGrowth-Cursor\`

## Próximos passos (pós-MVP)

1. Ícones PWA definitivos; teste instalação em dispositivo.
2. Sync cloud / backend (fora do escopo atual).
3. Import de backup JSON (não implementado — ver TODO abaixo).

## Decisões

- Arquitetura feature-based; UI não acessa Dexie.
- `analytics` agrega via repositories (leitura cross-feature documentada).
- Org GitHub: `RivasCode-Ops`.
