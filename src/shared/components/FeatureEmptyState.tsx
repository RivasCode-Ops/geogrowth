import type { ReactNode } from 'react';
import { Card } from '@/shared/components/Card';

type FeatureEmptyStateProps = {
  children: ReactNode;
};

export function FeatureEmptyState({ children }: FeatureEmptyStateProps) {
  return (
    <Card>
      <p className="empty-hint">{children}</p>
    </Card>
  );
}
