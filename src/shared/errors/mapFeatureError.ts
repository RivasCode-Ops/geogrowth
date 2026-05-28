export function mapFeatureError(
  error: unknown,
  knownErrors: readonly (new (...args: never[]) => Error)[],
  fallback = 'Ocorreu um erro inesperado.',
): string {
  if (error instanceof Error && knownErrors.some((Ctor) => error instanceof Ctor)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}
