import '@/shared/components/feature-ui.css';

type FeatureAlertProps = {
  message: string;
};

export function FeatureAlert({ message }: FeatureAlertProps) {
  return (
    <p className="feature-alert" role="alert">
      {message}
    </p>
  );
}
