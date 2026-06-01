export function resolvePullUrl(pushUrl: string, explicitPullUrl?: string): string {
  const custom = explicitPullUrl?.trim();
  if (custom) {
    return custom;
  }
  if (pushUrl.endsWith('/push')) {
    return `${pushUrl.slice(0, -5)}pull`;
  }
  return pushUrl.replace(/\/push\/?$/, '/pull');
}
