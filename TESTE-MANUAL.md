# GeoGrowth — Checklist de teste manual

Use após `npm run dev` (http://127.0.0.1:5190) ou `npm run preview` (http://127.0.0.1:5191).

Marque cada item só depois de testar na UI real. Recarregue a página (F5) após salvar para validar IndexedDB.

---

## 0. Pré-requisitos

- [ ] App abre sem erro no console
- [ ] Menu lateral: Loja, Empresas, Território, CRM, Visitas, Parcerias, Analytics

---

## 1. Loja (`/`)

- [ ] Cadastrar loja (nome, Tenant ID, Store ID)
- [ ] Recarregar F5 — dados permanecem
- [ ] Editar loja e salvar
- [ ] **Exportar backup JSON** — arquivo baixa
- [ ] (Opcional) **Importar backup** em aba anônima — confirma substituição e recarrega com dados

---

## 2. Empresas (`/companies`)

- [ ] Sem loja: mensagem pedindo cadastro em Loja
- [ ] Nova empresa (nome, status, tag)
- [ ] Listagem mostra a empresa
- [ ] Filtros: nome, status, tag
- [ ] Editar e excluir empresa
- [ ] F5 — persistência OK

---

## 3. Território (`/territory`)

- [ ] Nova área (nome, bbox, cor)
- [ ] Retângulo aparece no mapa (requer internet para tiles OSM)
- [ ] Selecionar área na lista / no mapa
- [ ] Editar e excluir área
- [ ] F5 — área permanece

---

## 4. CRM (`/crm`)

- [ ] Nova oportunidade vinculada a empresa
- [ ] Cards no board por estágio (lead, negociação, ganho, perdido)
- [ ] Filtrar por estágio
- [ ] Editar oportunidade (mudar estágio)
- [ ] Excluir oportunidade
- [ ] F5 — dados permanecem

---

## 5. Visitas (`/visits`)

- [ ] Nova visita (empresa, data/hora, status planejada)
- [ ] Tabela ordenada por data
- [ ] Filtrar por status
- [ ] Marcar como realizada / cancelada
- [ ] Excluir visita
- [ ] F5 — persistência OK

---

## 6. Parcerias (`/partnerships`)

- [ ] Nova parceria (parceiro, tipo, vigência)
- [ ] Com e sem empresa vinculada
- [ ] Filtrar por tipo
- [ ] Editar e excluir
- [ ] F5 — persistência OK

---

## 7. Analytics (`/analytics`)

- [ ] Com loja ativa: cards (empresas, oportunidades, visitas do mês)
- [ ] Contagem por estágio do CRM bate com dados cadastrados
- [ ] Sem loja: mensagem orientando ir em Loja

---

## 8. PWA (opcional, após `npm run build` + `npm run preview`)

- [ ] DevTools → Application → Service Worker registrado
- [ ] Manifest presente (`manifest.webmanifest`)
- [ ] (Chrome) “Instalar app” ou modo standalone disponível

---

## 9. IndexedDB (sanidade)

DevTools → Application → IndexedDB → `GeoGrowthDB`:

- [ ] `stores`, `companies`, `territories`, `deals`, `visits`, `partnerships`
- [ ] Registros com `storeId` / `tenantId` coerentes com a loja ativa

---

## Decisão

| Resultado | Ação |
|-----------|------|
| Tudo OK | MVP validado para uso local |
| Falha | Anotar rota + passo; corrigir antes de sync cloud |
