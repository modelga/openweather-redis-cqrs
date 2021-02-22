export function kelvinToCelsius(tK: number): string {
  return `${(tK - 273.15).toFixed(1)} ºC`;
}
