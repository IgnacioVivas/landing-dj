'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { djConfig } from './config'
import type { Show, Release, GalleryItem, ReleaseType, AspectRatio } from './types'

export interface DjPageData {
  name:       string
  tagline:    string
  taglineEn:  string
  genres:     string[]
  bio: {
    short:      string
    shortEn:    string
    full:       string
    fullEn:     string
    stats:      { label: string; value: string }[]
    photoUrl:   string | null
  }
  shows:    Show[]
  releases: Release[]
  gallery:  GalleryItem[]
  youtube:   { featuredVideoId: string | null; channelUrl: string | null }
  instagram: { username: string | null; profileUrl: string | null }
  social:    { instagram: string | null; spotify: string | null; soundcloud: string | null; youtube: string | null }
  contact:   { bookingEmail: string | null; pressEmail: string | null }
  mix:       { url: string | null }
  pressKit:  { riderUrl: string | null; epkUrl: string | null }
  countdown: { date: string; venue: string; city: string; country: string; address?: string; festival?: string } | null
  theme: {
    accentColor:        string
    accentColor2:       string
    heroImageUrl:       string | null
    heroImageMobileUrl: string | null
    heroTitle:          string | null
    heroTitleEn:        string | null
  }
  showsMode: 'list' | 'flyer'
}

const DjContext = createContext<DjPageData | null>(null)

export function DjProvider({ data, children }: { data: DjPageData; children: ReactNode }) {
  return <DjContext.Provider value={data}>{children}</DjContext.Provider>
}

function configToPageData(): DjPageData {
  return {
    name:       djConfig.name,
    tagline:    djConfig.tagline,
    taglineEn:  '',
    genres:     djConfig.genres,
    bio: {
      short:    djConfig.bio.short,
      shortEn:  '',
      full:     djConfig.bio.full,
      fullEn:   '',
      stats:    djConfig.bio.stats,
      photoUrl: null,
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
    mix:       { url: null },
    pressKit:  { riderUrl: null, epkUrl: null },
    countdown: null,
    theme: {
      accentColor:        '#8b5cf6',
      accentColor2:       '#22d3ee',
      heroImageUrl:       null,
      heroImageMobileUrl: null,
      heroTitle:          null,
      heroTitleEn:        null,
    },
    showsMode: 'list',
  }
}

export function useDjData(): DjPageData {
  return useContext(DjContext) ?? configToPageData()
}
