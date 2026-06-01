# CONTEXT — GeoGrowth

## Estado atual

MVP + UI + PWA/Pages + **Sync Fase 1 (push)** + **Sync Fase 2 (pull/merge)**.

## Workspace

- App: `c:\_PROJETOS\geogrowth`
- API sync: `c:\_PROJETOS\geogrowth-sync-api`
- Público: https://rivascode-ops.github.io/geogrowth/
- Docs sync: [docs/SYNC.md](./docs/SYNC.md)

## Sync

- Topbar: **Enviar** (push) + **Baixar** (pull)
- API local: `npm run sync:api` (porta 8787)
- App: `.env` com `VITE_SYNC_PUSH_URL`

## Próximos passos

1. Publicar `geogrowth-sync-api` (HTTPS) e apontar PWA build.
2. Fase 3: auth, Postgres, sync automático.
3. [TESTE-MANUAL.md](./TESTE-MANUAL.md)
