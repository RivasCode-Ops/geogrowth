import { useEffect } from 'react';

import { DealBoard } from '@/features/crm/components/DealBoard';

import { DealForm } from '@/features/crm/components/DealForm';

import { useCrmStore } from '@/features/crm/store/crm.store';

import type { DealsFilterStage } from '@/features/crm/types/deal';

import { DEAL_STAGES, DEAL_STAGE_LABELS } from '@/features/crm/types/stage';

import '@/features/crm/components/crm.css';

import { useStoreStore } from '@/features/store/store/store.store';

import { Card } from '@/shared/components/Card';

import { FeatureAlert } from '@/shared/components/FeatureAlert';

import { FeatureEmptyState } from '@/shared/components/FeatureEmptyState';

import { FeatureToolbar } from '@/shared/components/FeatureToolbar';



export function CrmPage() {

  const activeStore = useStoreStore((s) => s.activeStore);

  const deals = useCrmStore((s) => s.deals);

  const companies = useCrmStore((s) => s.companies);

  const stageFilter = useCrmStore((s) => s.stageFilter);

  const editingId = useCrmStore((s) => s.editingId);

  const isLoading = useCrmStore((s) => s.isLoading);

  const isSaving = useCrmStore((s) => s.isSaving);

  const error = useCrmStore((s) => s.error);

  const loadDeals = useCrmStore((s) => s.loadDeals);

  const setStageFilter = useCrmStore((s) => s.setStageFilter);

  const startCreate = useCrmStore((s) => s.startCreate);

  const startEdit = useCrmStore((s) => s.startEdit);

  const cancelEdit = useCrmStore((s) => s.cancelEdit);

  const saveDeal = useCrmStore((s) => s.saveDeal);

  const deleteDeal = useCrmStore((s) => s.deleteDeal);



  useEffect(() => {

    if (activeStore) {

      void loadDeals();

    }

  }, [activeStore, loadDeals]);



  const editingDeal =

    editingId && editingId !== 'new' ? (deals.find((d) => d.id === editingId) ?? null) : null;



  const showForm = editingId !== null;



  return (

    <section className="page feature-page">

      <FeatureToolbar

        title="CRM"

        description="Oportunidades vinculadas a empresas da loja ativa."

        actions={

          activeStore && !showForm && companies.length > 0 ? (

            <button type="button" className="btn btn--primary" onClick={startCreate}>

              Nova oportunidade

            </button>

          ) : null

        }

      />



      {error ? <FeatureAlert message={error} /> : null}



      {!activeStore ? (

        <FeatureEmptyState>

          Cadastre uma loja em <strong>Loja</strong> para usar o CRM.

        </FeatureEmptyState>

      ) : (

        <>

          {showForm ? (

            <Card

              title={editingDeal ? 'Editar oportunidade' : 'Nova oportunidade'}

              flushTop

            >

              <DealForm

                deal={editingId === 'new' ? null : editingDeal}

                companies={companies}

                isSaving={isSaving}

                onSubmit={saveDeal}

                onCancel={cancelEdit}

                onDelete={(id) => void deleteDeal(id)}

              />

            </Card>

          ) : (

            <Card title="Filtros" flushTop>

              <div className="filter-bar">

                <label className="filter-bar__label" htmlFor="crm-stage-filter">

                  Estágio

                </label>

                <select

                  id="crm-stage-filter"

                  className="select select--narrow"
                  value={stageFilter}

                  onChange={(e) => setStageFilter(e.target.value as DealsFilterStage)}

                >

                  <option value="all">Todos</option>

                  {DEAL_STAGES.map((stage) => (

                    <option key={stage} value={stage}>

                      {DEAL_STAGE_LABELS[stage]}

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

              Cadastre empresas em <strong>Empresas</strong> para criar oportunidades.

            </p>

          ) : showForm ? null : (

            <DealBoard deals={deals} onEdit={startEdit} />

          )}

        </>

      )}

    </section>

  );

}

