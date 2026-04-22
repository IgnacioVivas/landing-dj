'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { djConfig } from './config'
import type { Show, Release, GalleryItem, ReleaseType, AspectRatio } from './types'

export interface DjPageData {
  name:     string
  tagline:  string
  genres:   string[]
  bio: {
    short: string
    full:  string
    stats: { label: string; value: string }[]
  }
  shows:    Show[]
  releases: Release[]
  gallery:  GalleryItem[]
  youtube:  { featuredVideoId: string | null; channelUrl: string | null }
  instagram:{ username: string | null; profileUrl: string | null }
  social:   { instagram: string | null; spotify: string | null; soundcloud: string | null; youtube: string | null }
  contact:  { bookingEmail: string | null; pressEmail: string | null }
}

const DjContext = createContext<DjPageData | null>(null)

export function DjProvider({ data, children }: { data: DjPageData; children: ReactNode }) {
  return <DjContext.Provider value={data}>{children}</DjContext.Provider>
}

function configToPageData(): DjPageData {
  return {
    name:    djConfig.name,
    tagline: djConfig.tagline,
    genres:  djConfig.genres,
    bio: {
      short: djConfig.bio.short,
      full:  djConfig.bio.full,
      stats: djConfig.bio.stats,
    },
    shows:    djConfig.shows as Show[],
    releases: djConfig.releases as Release[],
    gallery:  djConfig.gallery as GalleryItem[],
    youtube:  { featuredVideoId: djConfig.youtube.featuredVideoId, channelUrl: djConfig.youtube.channelUrl },
    instagram:{ username: djConfig.instagram.username.replace('@', ''), profileUrl: djConfig.instagram.profileUrl },
    social: {
      instagram:  djConfig.social.instagram,
      spotify:    djConfig.social.spotify,
      soundcloud: djConfig.social.soundcloud,
      youtube:    djConfig.social.youtube,
    },
    contact: {
      bookingEmail: djConfig.contact.bookingEmail,
      pressEmail:   djConfig.contact.pressEmail,
    },
  }
}

export function useDjData(): DjPageData {
  return useContext(DjContext) ?? configToPageData()
}
