export function toDashCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}