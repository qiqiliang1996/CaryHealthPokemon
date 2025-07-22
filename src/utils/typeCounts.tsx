import type { TypeCount } from '../types';

/** Build sorted counts array from a flat list of type names. */
export function buildTypeCounts(typeNames: string[]): TypeCount[] {
  const map: Record<string, number> = {};
  typeNames.forEach((n) => {
    map[n] = (map[n] ?? 0) + 1;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Convert one type's count to percentage string (e.g., "20.00%"). */
export function typePercent(name: string, data: TypeCount[]): string {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (!total) return '0%';
  const target = data.find((i) => i.name === name);
  if (!target) return '0%';
  return ((target.value / total) * 100).toFixed(2) + '%';
}
