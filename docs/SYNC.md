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
npm run dev
```

Sem URL: o botão **Sincronizar** informa que o endpoint não está configurado.

## Contrato mínimo do servidor (Fase 1)

- Método: `POST`
- Header: `Content-Type: application/json`
- Resposta: `2xx` para aceitar o lote
- Corpo: persistir JSON como snapshot ou ingerir por tabela (implementação sua)

Exemplo Node/Express (referência):

```js
app.post('/api/geogrowth/sync/push', express.json({ limit: '2mb' }), (req, res) => {
  // validar req.body.app === 'geogrowth'
  res.status(200).json({ ok: true });
});
```

## Próximas fases (não implementadas)

- Pull / merge bidirecional com `updatedAt`
- Auth (API key / OAuth)
- Adapter Supabase ou fila realtime
- Resolução de conflitos
