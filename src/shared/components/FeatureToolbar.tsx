import type { ReactNode } from 'react';
import '@/shared/components/feature-ui.css';

type FeatureToolbarProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function FeatureToolbar({ title, description, actions }: FeatureToolbarProps) {
  return (
    <div className="feature-toolbar">
      <div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="feature-toolbar__actions">{actions}</div> : null}
    </div>
  );
}
