/**
 * String helpers shared across features.
 */

export function initialsFromName(name) {
  const cleaned = String(name || '').trim();
  if (!cleaned) {
    return '?';
  }
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const second = parts.length > 1 ? parts[1]?.[0] ?? '' : (parts[0]?.[1] ?? '');
  return (first + second).toUpperCase().slice(0, 3) || cleaned.slice(0, 1).toUpperCase();
}
