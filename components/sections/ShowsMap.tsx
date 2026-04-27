'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useDjData } from '@/lib/dj-context'
import AnimatedSection from '@/components/ui/AnimatedSection'
import SectionHeading from '@/components/ui/SectionHeading'
import type { ShowPin } from '@/components/ui/LeafletMap'

const LeafletMap = dynamic(() => import('@/components/ui/LeafletMap'), { ssr: false })

async function geocode(city: string, country: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const q   = encodeURIComponent(`${city}, ${country}`)
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`,
    )
    const data = await res.json()
    if (!data[0]) return null
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {
    return null
  }
}

function sleep(ms: number) {
  return new Promise<void>(r => setTimeout(r, ms))
}

export default function ShowsMap() {
  const { shows, theme } = useDjData()
  const [pins, setPins]     = useState<ShowPin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!shows.length) { setLoading(false); return }

    async function load() {
      const cacheKey = `djmap_${shows.map(s => `${s.city}|${s.country}`).sort().join('_')}`

      const cached = sessionStorage.getItem(cacheKey)
      if (cached) {
        setPins(JSON.parse(cached))
        setLoading(false)
        return
      }

      // Geocode unique city+country pairs (Nominatim: max 1 req/sec)
      const uniquePairs = [...new Set(shows.map(s => `${s.city}||${s.country}`))]
      const geoMap: Record<string, { lat: number; lng: number } | null> = {}

      for (const pair of uniquePairs) {
        const [city, country] = pair.split('||')
        geoMap[pair] = await geocode(city, country)
        if (uniquePairs.indexOf(pair) < uniquePairs.length - 1) await sleep(250)
      }

      const result: ShowPin[] = shows.flatMap(s => {
        const geo = geoMap[`${s.city}||${s.country}`]
        if (!geo) return []
        return [{
          lat:      geo.lat,
          lng:      geo.lng,
          venue:    s.venue,
          city:     s.city,
          country:  s.country,
          date:     s.date,
          isPast:   s.isPast ?? false,
          festival: s.festival,
        }]
      })

      sessionStorage.setItem(cacheKey, JSON.stringify(result))
      setPins(result)
      setLoading(false)
    }

    load()
  }, [shows])

  if (!shows.length) return null

  return (
    <section id="showsmap" className="py-24 md:py-32" style={{ background: '#050509' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-10">
          <SectionHeading overline="Gira mundial" title="Mapa de Shows" />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {loading ? (
              <div
                className="h-[440px] flex items-center justify-center"
                style={{ background: '#07070f' }}
              >
                <p className="font-mono text-xs text-slate-600 animate-pulse tracking-widest">
                  Cargando mapa...
                </p>
              </div>
            ) : pins.length > 0 ? (
              <LeafletMap pins={pins} accentColor={theme.accentColor} />
            ) : (
              <div
                className="h-[440px] flex items-center justify-center"
                style={{ background: '#07070f' }}
              >
                <p className="font-mono text-xs text-slate-700">Sin coordenadas disponibles.</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mt-3 justify-end">
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-slate-600">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: theme.accentColor }} />
              Próximos
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-slate-700">
              <span className="w-2 h-2 rounded-full inline-block bg-slate-700" />
              Pasados
            </span>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
