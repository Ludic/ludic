export function normalize(val: number, max=1, min=0): number {
  return (val - min) / (max - min)
}
