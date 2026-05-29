import type { ReactNode } from 'react';
import { PageHeader } from '@/shared/components/PageHeader';

type FeatureToolbarProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

/** @deprecated Prefer PageHeader directly; mantido para compatibilidade nas features. */
export function FeatureToolbar({ title, description, actions }: FeatureToolbarProps) {
  return <PageHeader title={title} subtitle={description} actions={actions} />;
}
