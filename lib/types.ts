export type ReleaseType = 'album' | 'ep' | 'single'
export type ContactType = 'booking' | 'press' | 'other'
export type AspectRatio = 'portrait' | 'landscape' | 'square'

export interface StreamingLinks {
  spotify?: string
  appleMusic?: string
  soundcloud?: string
  beatport?: string
}

export interface Release {
  id: string
  title: string
  year: number
  coverGradient: string
  coverImageUrl?: string
  type: ReleaseType
  label?: string
  links: StreamingLinks
}

export interface Show {
  id: string
  date: string
  city: string
  country: string
  venue: string
  festival?: string
  ticketUrl?: string
  flyerUrl?: string
  isSoldOut?: boolean
  isPast?: boolean
}

export interface GalleryItem {
  id: string
  imageUrl?: string | null
  gradient: string
  caption: string
  captionEn: string
  aspect: AspectRatio
}

export interface InstagramPost {
  id: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  thumbnail_url?: string
  permalink: string
  timestamp: string
}

export interface ContactFormData {
  name: string
  email: string
  type: ContactType
  message: string
}

export interface Stat {
  label: string
  value: string
}
