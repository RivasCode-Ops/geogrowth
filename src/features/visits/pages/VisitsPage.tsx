import { useEffect } from 'react';

import { VisitForm } from '@/features/visits/components/VisitForm';

import { VisitsTable } from '@/features/visits/components/VisitsTable';

import { useVisitsStore } from '@/features/visits/store/visits.store';

import type { VisitsFilterStatus } from '@/features/visits/types/visit';

import { VISIT_STATUSES, VISIT_STATUS_LABELS } from '@/features/visits/types/visit';

import '@/features/visits/components/visits.css';

import { useStoreStore } from '@/features/store/store/store.store';

import { Card } from '@/shared/components/Card';

import { FeatureAlert } from '@/shared/components/FeatureAlert';

import { FeatureEmptyState } from '@/shared/components/FeatureEmptyState';

import { FeatureToolbar } from '@/shared/components/FeatureToolbar';



export function VisitsPage() {

  const activeStore = useStoreStore((s) => s.activeStore);

  const visits = useVisitsStore((s) => s.visits);

  const companies = useVisitsStore((s) => s.companies);

  const statusFilter = useVisitsStore((s) => s.statusFilter);

  const editingId = useVisitsStore((s) => s.editingId);

  const isLoading = useVisitsStore((s) => s.isLoading);

  const isSaving = useVisitsStore((s) => s.isSaving);

  const error = useVisitsStore((s) => s.error);

  const loadVisits = useVisitsStore((s) => s.loadVisits);

  const setStatusFilter = useVisitsStore((s) => s.setStatusFilter);

  const startCreate = useVisitsStore((s) => s.startCreate);

  const startEdit = useVisitsStore((s) => s.startEdit);

  const cancelEdit = useVisitsStore((s) => s.cancelEdit);

  const saveVisit = useVisitsStore((s) => s.saveVisit);

  const deleteVisit = useVisitsStore((s) => s.deleteVisit);



  useEffect(() => {

    if (activeStore) {

      void loadVisits();

    }

  }, [activeStore, loadVisits]);



  const editingVisit =

    editingId && editingId !== 'new'

      ? (visits.find((v) => v.id === editingId) ?? null)

      : null;



  const showForm = editingId !== null;



  return (

    <section className="page feature-page">

      <FeatureToolbar

        title="Visitas"

        description="Agende e registre visitas de campo por empresa (ordenadas por data)."

        actions={

          activeStore && !showForm && companies.length > 0 ? (

            <button type="button" className="btn btn--primary" onClick={startCreate}>

              Nova visita

            </button>

          ) : null

        }

      />



      {error ? <FeatureAlert message={error} /> : null}



      {!activeStore ? (

        <FeatureEmptyState>

          Cadastre uma loja em <strong>Loja</strong> para gerenciar visitas.

        </FeatureEmptyState>

      ) : (

        <>

          {showForm ? (

            <Card title={editingVisit ? 'Editar visita' : 'Nova visita'} flushTop>

              <VisitForm

                visit={editingId === 'new' ? null : editingVisit}

                companies={companies}

                isSaving={isSaving}

                onSubmit={saveVisit}

                onCancel={cancelEdit}

                onDelete={(id) => void deleteVisit(id)}

              />

            </Card>

          ) : (

            <Card title="Filtros" flushTop>

              <div className="filter-bar">

                <label className="filter-bar__label" htmlFor="visits-status-filter">

                  Status

                </label>

                <select

                  id="visits-status-filter"

                  className="select select--narrow"
                  value={statusFilter}

                  onChange={(e) => setStatusFilter(e.target.value as VisitsFilterStatus)}

                >

                  <option value="all">Todos</option>

                  {VISIT_STATUSES.map((status) => (

                    <option key={status} value={status}>

                      {VISIT_STATUS_LABELS[status]}

                    </option>

                  ))}

                </select>

              </div>

            </Card>

          )}



          {isLoading ? (

            <p className="loading-text">Carregando…</p>

          ) : companies.length === 0 ? (

            <p className="empty-hint">

              Cadastre empresas em <strong>Empresas</strong> para agendar visitas.

            </p>

          ) : showForm ? null : (

            <Card title="Agenda de visitas" flushTop>

              <VisitsTable visits={visits} onEdit={startEdit} />

            </Card>

          )}

        </>

      )}

    </section>

  );

}

