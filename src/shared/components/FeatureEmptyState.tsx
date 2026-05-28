import type { ReactNode } from 'react';
import '@/shared/components/feature-ui.css';

type FeatureEmptyStateProps = {
  children: ReactNode;
};

export function FeatureEmptyState({ children }: FeatureEmptyStateProps) {
  return <p className="feature-empty">{children}</p>;
}
