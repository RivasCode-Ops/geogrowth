# CONTEXT — GeoGrowth

## Estado atual

**MVP local** (blocos 1–10) + design system + PWA/Pages + **Sync Fase 1** (push HTTP via `VITE_SYNC_PUSH_URL`).

## Workspace

- App: `c:\_PROJETOS\geogrowth`
- Método: `c:\_PROJETOS\workbench\GeoGrowth-Cursor\`
- Público: https://rivascode-ops.github.io/geogrowth/
- Sync: [docs/SYNC.md](./docs/SYNC.md)

## Sync (Fase 1)

- Salvamentos marcam `syncStatus: 'pending'`.
- Topbar: contagem + botão **Sincronizar** (POST JSON pendências).
- Sem URL → mensagem para configurar `.env`.
- Pull/merge/auth: **não implementado**.

## API de sync (Fase 1)

- Repo: `c:\_PROJETOS\geogrowth-sync-api` — `POST /api/geogrowth/sync/push`
- Local: `VITE_SYNC_PUSH_URL=http://127.0.0.1:8787/api/geogrowth/sync/push`

## Próximos passos

1. Subir API (`npm run dev` na sync-api) e testar botão **Sincronizar**.
2. Publicar `geogrowth-sync-api` no GitHub + deploy HTTPS.
2. Fase 2: pull + conflitos + auth.
3. [TESTE-MANUAL.md](./TESTE-MANUAL.md) + checklist sync.

## Decisões

- UI não acessa Dexie; sync via `core/sync` + `sync.store`.
- Dev: http://127.0.0.1:5190 | LAN: `npm run preview:lan`
