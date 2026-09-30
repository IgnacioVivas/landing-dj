'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

export type ShowPin = {
  lat:      number
  lng:      number
  venue:    string
  city:     string
  country:  string
  date:     string
  isPast:   boolean
  festival?: string
}

type Props = {
  pins:        ShowPin[]
  accentColor: string
}

export default function LeafletMap({ pins, accentColor }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !pins.length) return

    let map: import('leaflet').Map | null = null

    async function init() {
      const L = (await import('leaflet')).default

      map = L.map(containerRef.current!, {
        center:               [20, 0],
        zoom:                 2,
        zoomControl:          true,
        scrollWheelZoom:      false,
        attributionControl:   false,
      })

      // CARTO's basemaps.cartocdn.com started requiring a paid API key in
      // late Aug 2026 (keyless requests now return an "API KEY REQUIRED"
      // placeholder image instead of a real tile). Esri's dark canvas is a
      // free, keyless alternative with a similar look — note its REST tile
      // path is z/y/x, not the usual z/x/y, hence the placeholder order below.
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16,
      }).addTo(map)

      L.control.attribution({ prefix: false })
        .addAttribution('Tiles © <a href="https://www.esri.com">Esri</a>')
        .addTo(map)

      const upcoming = pins.filter(p => !p.isPast)
      const past     = pins.filter(p => p.isPast)

      function addMarker(pin: ShowPin) {
        const dateStr = new Date(pin.date).toLocaleDateString('es-AR', {
          day: 'numeric', month: 'long', year: 'numeric',
        })
        // A light ring (instead of a same-hue stroke) is what actually keeps
        // these visible against the map tiles — Esri's basemap is a mid-gray,
        // not the near-black CARTO used before, so a colored dot with a
        // same-color border used to blend into it far more than it did back then.
        const marker = L.circleMarker([pin.lat, pin.lng], {
          radius:      pin.isPast ? 6 : 10,
          fillColor:   pin.isPast ? '#64748b' : accentColor,
          color:       pin.isPast ? '#cbd5e1' : '#ffffff',
          weight:      pin.isPast ? 1.5 : 2.5,
          fillOpacity: pin.isPast ? 0.55 : 1,
          opacity:     pin.isPast ? 0.7 : 1,
          className:   pin.isPast ? 'dj-map-marker-past' : 'dj-map-marker-upcoming',
        })
        marker.bindPopup(
          `<div class="dj-popup">
            <strong>${pin.venue}</strong>
            <span class="dj-popup-city">${pin.city}, ${pin.country}</span>
            <span class="dj-popup-date">${dateStr}</span>
            ${pin.festival ? `<span class="dj-popup-festival">${pin.festival}</span>` : ''}
          </div>`,
          { className: 'dj-map-popup', minWidth: 160 },
        )
        marker.addTo(map!)
      }

      past.forEach(addMarker)
      upcoming.forEach(addMarker)

      const bounds = L.latLngBounds(pins.map(p => [p.lat, p.lng] as [number, number]))
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 })
    }

    init()

    return () => {
      map?.remove()
    }
  }, [pins, accentColor])

  return (
    <>
      <style>{`
        .dj-map-popup .leaflet-popup-content-wrapper {
          background: #0d0d1a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6);
          padding: 0;
        }
        .dj-map-popup .leaflet-popup-content {
          margin: 0;
        }
        .dj-map-popup .leaflet-popup-tip {
          background: #0d0d1a;
        }
        .dj-map-popup .leaflet-popup-close-button {
          color: #475569 !important;
          top: 6px !important;
          right: 8px !important;
        }
        .dj-popup {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 12px 14px;
          font-family: monospace;
        }
        .dj-popup strong {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #f1f5f9;
          display: block;
          margin-bottom: 2px;
        }
        .dj-popup-city    { font-size: 11px; color: #475569; }
        .dj-popup-date    { font-size: 11px; color: ${accentColor}; }
        .dj-popup-festival { font-size: 10px; color: #94a3b8; margin-top: 2px; }
        .leaflet-container { background: #07070f; }
        .dj-map-marker-upcoming { filter: drop-shadow(0 0 5px ${accentColor}); }
        .dj-map-marker-past     { filter: drop-shadow(0 0 2px rgba(0,0,0,0.6)); }
      `}</style>
      <div ref={containerRef} style={{ height: '440px', width: '100%' }} />
    </>
  )
}
