export const HERO_TITLE_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const
export type HeroTitleSize = typeof HERO_TITLE_SIZES[number]

// 'md' = tamaño que tenía el hero antes de esta feature (default, no rompe nada existente)
export const HERO_SIZE_SCALE: Record<HeroTitleSize, number> = {
  xs: 0.6,
  sm: 0.8,
  md: 1,
  lg: 1.25,
  xl: 1.5,
}

export const HERO_SIZE_LABELS: Record<HeroTitleSize, string> = {
  xs: 'XS',
  sm: 'S',
  md: 'M',
  lg: 'L',
  xl: 'XL',
}
