export async function pause(ms: number) {
  return new Promise<void>((resolve, reject) => setTimeout(resolve, ms));
}

export function range(start: number, end: number) {
  return Array.from({ length: end - start }, (v, k) => k + start);
}
