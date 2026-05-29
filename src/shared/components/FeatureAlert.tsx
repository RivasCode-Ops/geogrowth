type FeatureAlertProps = {
  message: string;
};

export function FeatureAlert({ message }: FeatureAlertProps) {
  return (
    <p className="alert alert--error" role="alert">
      {message}
    </p>
  );
}
