import type { ReactNode } from 'react';

type CardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  flushTop?: boolean;
  className?: string;
};

export function Card({ title, description, children, flushTop, className = '' }: CardProps) {
  const hasHeader = Boolean(title || description);

  return (
    <section className={`card ${className}`.trim()}>
      {hasHeader ? (
        <div className="card__header">
          {title ? <h2 className="card__title">{title}</h2> : null}
          {description ? <p className="card__description">{description}</p> : null}
        </div>
      ) : null}
      <div className={`card__body${flushTop && hasHeader ? ' card__body--flush-top' : ''}`}>
        {children}
      </div>
    </section>
  );
}
