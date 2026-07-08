const LOGO_COLORS = [
  'EA580C',
  '2563EB',
  '7C3AED',
  '059669',
  'DC2626',
  'D97706',
  '0891B2',
  'BE185D',
] as const;

export function buildProductLogoUrl(name: string, seed = 0): string {
  const color = LOGO_COLORS[Math.abs(seed) % LOGO_COLORS.length];
  const encodedName = encodeURIComponent(name);

  return `https://ui-avatars.com/api/?name=${encodedName}&background=${color}&color=ffffff&size=128&bold=true&format=png`;
}

export function getProductLogoUrl(
  name: string,
  logoUrl: string | null | undefined,
  seed = 0,
): string {
  return logoUrl?.trim() || buildProductLogoUrl(name, seed);
}
