# GeoGrowth — Sync em nuvem (Fase 1)

## Objetivo

Enviar alterações locais (IndexedDB) para um endpoint HTTP configurável, sem acoplar o app a um provedor específico nesta fase.

## Fluxo

1. Ao salvar entidades, `syncStatus` passa a `pending` (ou permanece `local` / `error` até sync).
2. A topbar mostra contagem de pendências.
3. **Sincronizar** envia `POST` JSON para `VITE_SYNC_PUSH_URL`.
4. Sucesso → registros do escopo da loja ativa ficam `synced`.
5. Falha → escopo marcado como `error` (retry manual).

## Payload (`SyncPushPayload`)

Mesma estrutura do backup (`app`, `dbVersion`, `exportedAt`, `data`), mais:

- `tenantId`, `storeId`, `pendingTotal`
- `data` contém **apenas** registros com status `local`, `pending` ou `error`

## Configuração

```bash
cp .env.example .env
# Edite VITE_SYNC_PUSH_URL=https://...
# Se a API exige chave: VITE_SYNC_API_KEY=mesmo-valor-de-SYNC_API_KEY
npm run dev
```

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `VITE_SYNC_PUSH_URL` | Sim (para sync) | URL do `POST` push |
| `VITE_SYNC_API_KEY` | Não | Enviada no header `X-API-Key` quando definida |

Sem URL: o botão **Sincronizar** informa que o endpoint não está configurado.

> **Nota:** em PWA o valor de `VITE_*` fica no bundle do cliente. Use chave só para ambiente controlado ou troque por proxy/backend na Fase 2.

## Contrato mínimo do servidor (Fase 1)

- Método: `POST`
- Header: `Content-Type: application/json`
- Resposta: `2xx` para aceitar o lote
- Corpo: persistir JSON como snapshot ou ingerir por tabela (implementação sua)

## API oficial (repo irmão)

Implementação pronta: **`geogrowth-sync-api`** (`c:\_PROJETOS\geogrowth-sync-api`).

```powershell
cd c:\_PROJETOS\geogrowth-sync-api
npm install
copy .env.example .env
npm run dev
```

No app:

```env
VITE_SYNC_PUSH_URL=http://127.0.0.1:8787/api/geogrowth/sync/push
# Se SYNC_API_KEY estiver definida na API:
# VITE_SYNC_API_KEY=sua-chave-dev
```

Snapshots em `data/snapshots/{tenantId}/{storeId}/`. Ver README da API.

## Próximas fases (não implementadas)

- Pull / merge bidirecional com `updatedAt`
- Auth (API key / OAuth)
- Adapter Supabase ou fila realtime
- Resolução de conflitos
