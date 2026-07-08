export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function nameToUsername(name: string): string {
  return slugify(name);
}

export function userProfilePath(name: string): string {
  return `/users/${nameToUsername(name)}`;
}
