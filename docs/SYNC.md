# GeoGrowth — Sync em nuvem

## Fase 1 — Push (enviar)

1. Ao salvar, `syncStatus` → `pending`.
2. Topbar mostra pendências.
3. **Enviar** → `POST` em `VITE_SYNC_PUSH_URL`.
4. Sucesso → `synced` | Falha → `error`.

## Fase 2 — Pull (baixar)

1. Servidor mantém `_canonical.json` por tenant/loja (merge por `id` + `updatedAt`).
2. **Baixar** → `GET` …/sync/pull?tenantId=&storeId=
3. App faz merge local (last-write-wins por `updatedAt`) e recarrega a página.

## Configuração local

Terminal 1 — API:

```powershell
cd c:\_PROJETOS\geogrowth
npm run sync:api
```

Terminal 2 — App:

```powershell
cp .env.example .env
npm run dev
```

`.env` do app:

```env
VITE_SYNC_PUSH_URL=http://127.0.0.1:8787/api/geogrowth/sync/push
# Pull derivado automaticamente (/pull). Opcional:
# VITE_SYNC_PULL_URL=http://127.0.0.1:8787/api/geogrowth/sync/pull
# VITE_SYNC_API_KEY=mesma-chave-da-api
```

| Variável | Descrição |
|----------|-----------|
| `VITE_SYNC_PUSH_URL` | POST push |
| `VITE_SYNC_PULL_URL` | GET pull (opcional) |
| `VITE_SYNC_API_KEY` | Header `X-API-Key` |

## API (`geogrowth-sync-api`)

| Método | Rota |
|--------|------|
| POST | `/api/geogrowth/sync/push` |
| GET | `/api/geogrowth/sync/pull?tenantId=&storeId=` |
| GET | `/api/geogrowth/sync/last?tenantId=&storeId=` (meta) |

Repo: `c:\_PROJETOS\geogrowth-sync-api`

## Teste rápido

1. Cadastre loja + empresas no app.
2. **Enviar** → snapshot na API.
3. Em outro navegador/dispositivo (mesma loja) → **Baixar**.

## Próximo (Fase 3)

- Auth por loja, Postgres, conflitos explícitos, sync automático.
