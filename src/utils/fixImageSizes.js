/**
 * Replaces sizes="..." attributes in HTML strings with sizes="100vw".
 * WordPress generates sizes="auto, ..." which Safari does not support (Chrome 109+ only),
 * causing Safari to pick the smallest srcset image. This ensures the correct image is chosen.
 */
export function fixImageSizes(str) {
  return str.replace(/\bsizes="[^"]*"/g, 'sizes="100vw"')
}
