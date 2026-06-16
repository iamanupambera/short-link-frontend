export function formatNumber(value: number) {
  return new Intl.NumberFormat('en', {
    notation: value >= 10000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value);
}

export function getUrlHost(value: string) {
  try {
    return new URL(value).host;
  } catch {
    return value;
  }
}

export function truncateMiddle(value: string, maxLength = 48) {
  if (value.length <= maxLength) {
    return value;
  }

  const keep = Math.floor((maxLength - 3) / 2);
  return `${value.slice(0, keep)}...${value.slice(-keep)}`;
}
