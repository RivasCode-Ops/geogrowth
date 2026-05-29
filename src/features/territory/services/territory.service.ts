import { nowIso } from '@/core/utils/timestamps';
import type { TerritoryBounds } from '@/core/db/schema';
import { territoryRepository } from '@/features/territory/repository/territory.repository';
import type { SaveTerritoryInput, Territory } from '@/features/territory/types/territory';

export class TerritoryValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TerritoryValidationError';
  }
}

export class TerritoryStoreRequiredError extends Error {
  constructor() {
    super('Cadastre uma loja ativa antes de gerenciar territórios.');
    this.name = 'TerritoryStoreRequiredError';
  }
}

function trimRequired(value: string, field: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new TerritoryValidationError(`${field} é obrigatório.`);
  }
  return trimmed;
}

function validateBounds(bounds: TerritoryBounds): TerritoryBounds {
  const { north, south, east, west } = bounds;
  if (north <= south) {
    throw new TerritoryValidationError('Latitude norte deve ser maior que a sul.');
  }
  if (east <= west) {
    throw new TerritoryValidationError('Longitude leste deve ser maior que a oeste.');
  }
  if (north > 90 || south < -90 || east > 180 || west < -180) {
    throw new TerritoryValidationError('Coordenadas fora do intervalo válido.');
  }
  return { north, south, east, west };
}

export const territoryService = {
  async list(storeId: string, tenantId: string): Promise<Territory[]> {
    if (!storeId || !tenantId) {
      throw new TerritoryStoreRequiredError();
    }
    return territoryRepository.listByStore(storeId);
  },

  async create(
    storeId: string,
    tenantId: string,
    input: SaveTerritoryInput,
  ): Promise<Territory> {
    if (!storeId || !tenantId) {
      throw new TerritoryStoreRequiredError();
    }
    const name = trimRequired(input.name, 'Nome');
    const bounds = validateBounds(input.bounds);
    const territory: Territory = {
      id: crypto.randomUUID(),
      name,
      description: input.description.trim(),
      bounds,
      color: input.color,
      storeId,
      tenantId,
      updatedAt: nowIso(),
      syncStatus: 'pending',
    };
    await territoryRepository.create(territory);
    return territory;
  },

  async update(storeId: string, input: SaveTerritoryInput): Promise<Territory> {
    if (!storeId) {
      throw new TerritoryStoreRequiredError();
    }
    if (!input.id) {
      throw new TerritoryValidationError('ID do território é obrigatório para edição.');
    }
    const existing = await territoryRepository.getById(input.id);
    if (!existing || existing.storeId !== storeId) {
      throw new TerritoryValidationError('Território não encontrado.');
    }
    const updated: Territory = {
      ...existing,
      name: trimRequired(input.name, 'Nome'),
      description: input.description.trim(),
      bounds: validateBounds(input.bounds),
      color: input.color,
      updatedAt: nowIso(),
      syncStatus: 'pending',
    };
    await territoryRepository.update(updated);
    return updated;
  },

  async delete(storeId: string, id: string): Promise<void> {
    if (!storeId) {
      throw new TerritoryStoreRequiredError();
    }
    const existing = await territoryRepository.getById(id);
    if (!existing || existing.storeId !== storeId) {
      throw new TerritoryValidationError('Território não encontrado.');
    }
    await territoryRepository.delete(id);
  },
};
