export const HERO_ALIGNS = ['left', 'center', 'right'] as const
export type HeroAlign = typeof HERO_ALIGNS[number]

export const HERO_ALIGN_LABELS: Record<HeroAlign, string> = {
  left:   'Izquierda',
  center: 'Centro',
  right:  'Derecha',
}
