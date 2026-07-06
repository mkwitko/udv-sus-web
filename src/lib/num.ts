/** Converte string de litros/kg ("1,5" ou "1.5") em número. */
export function parseNum(value: string | number | null | undefined): number {
  if (typeof value === 'number') return value
  if (!value) return 0
  const n = Number(String(value).replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

/** Formata número com N casas, vírgula decimal pt-BR. */
export function fmtNum(value: number, digits = 2): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}
