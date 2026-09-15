'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Play, Pause } from '@phosphor-icons/react'
import { useDjData } from '@/lib/dj-context'
import { detectEmbeddablePlatform, toEmbedUrl, toSpotifyUri } from '@/lib/music-platforms'

declare global {
  interface Window {
    SC?: { Widget: SoundCloudWidgetFactory }
    Mixcloud?: { PlayerWidget: (iframe: HTMLIFrameElement) => MixcloudWidget }
    onSpotifyIframeApiReady?: (api: SpotifyIFrameApi) => void
  }
}

type SoundCloudWidget = {
  bind: (event: string, cb: (e?: unknown) => void) => void
  play: () => void
  pause: () => void
}
type SoundCloudWidgetFactory = ((iframe: HTMLIFrameElement) => SoundCloudWidget) & {
  Events: { READY: string; PLAY: string; PAUSE: string; FINISH: string }
}
type MixcloudWidget = {
  ready: Promise<void>
  play: () => void
  pause: () => void
  events: {
    play:  { on: (cb: () => void) => void }
    pause: { on: (cb: () => void) => void }
    ended: { on: (cb: () => void) => void }
  }
}
type SpotifyController = {
  togglePlay: () => void
  addListener: (event: string, cb: (e: { data: { isPaused: boolean } }) => void) => void
}
type SpotifyIFrameApi = {
  createController: (
    element: HTMLElement,
    options: { uri: string; width?: string; height?: string },
    cb: (controller: SpotifyController) => void,
  ) => void
}

// Loads each provider's SDK on demand — only the one matching this DJ's
// pinned link ever gets fetched.
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const s = document.createElement('script')
    s.src = src
    s.async = true
    s.onload  = () => resolve()
    s.onerror = () => reject(new Error(`No se pudo cargar ${src}`))
    document.body.appendChild(s)
  })
}

// Play/pause icon pinned to the nav — no autoplay-on-arrival (browsers
// block that, and Spotify doesn't offer it either), but the visitor is one
// click away from listening without leaving the top of the page. The real
// widget stays mounted but visually hidden (0x0, clipped); this button just
// drives it through each platform's own JS control API.
export default function NavPlayerButton({ size = 18 }: { size?: number }) {
  const { mix } = useDjData()
  const url      = mix.pinnedUrl
  const platform = url ? detectEmbeddablePlatform(url) : null

  const iframeRef     = useRef<HTMLIFrameElement>(null)
  const spotifyDivRef  = useRef<HTMLDivElement>(null)
  const controllerRef  = useRef<SoundCloudWidget | MixcloudWidget | SpotifyController | null>(null)
  const [ready,   setReady]   = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!platform || !url) return
    let cancelled = false

    if (platform === 'soundcloud') {
      loadScript('https://w.soundcloud.com/player/api.js').then(() => {
        if (cancelled || !iframeRef.current || !window.SC) return
        const widget = window.SC.Widget(iframeRef.current)
        controllerRef.current = widget
        widget.bind(window.SC.Widget.Events.READY,  () => !cancelled && setReady(true))
        widget.bind(window.SC.Widget.Events.PLAY,   () => !cancelled && setPlaying(true))
        widget.bind(window.SC.Widget.Events.PAUSE,  () => !cancelled && setPlaying(false))
        widget.bind(window.SC.Widget.Events.FINISH, () => !cancelled && setPlaying(false))
      }).catch(() => {})
    }

    if (platform === 'mixcloud') {
      loadScript('https://widget.mixcloud.com/media/js/widgetApi.js').then(() => {
        if (cancelled || !iframeRef.current || !window.Mixcloud) return
        const widget = window.Mixcloud.PlayerWidget(iframeRef.current)
        widget.ready.then(() => {
          if (cancelled) return
          controllerRef.current = widget
          setReady(true)
          widget.events.play.on(()  => !cancelled && setPlaying(true))
          widget.events.pause.on(() => !cancelled && setPlaying(false))
          widget.events.ended.on(() => !cancelled && setPlaying(false))
        })
      }).catch(() => {})
    }

    if (platform === 'spotify') {
      const uri = toSpotifyUri(url)
      if (!uri) return
      window.onSpotifyIframeApiReady = (IFrameAPI) => {
        if (cancelled || !spotifyDivRef.current) return
        IFrameAPI.createController(spotifyDivRef.current, { uri, width: '300', height: '80' }, (controller) => {
          if (cancelled) return
          controllerRef.current = controller
          setReady(true)
          controller.addListener('playback_update', (e) => !cancelled && setPlaying(!e.data.isPaused))
        })
      }
      loadScript('https://open.spotify.com/embed/iframe-api/v1').catch(() => {})
    }

    return () => { cancelled = true; controllerRef.current = null }
  }, [platform, url])

  const toggle = useCallback(() => {
    const c = controllerRef.current
    if (!c) return
    if (platform === 'spotify') {
      (c as SpotifyController).togglePlay()
      return
    }
    const widget = c as SoundCloudWidget | MixcloudWidget
    if (playing) widget.pause()
    else widget.play()
  }, [platform, playing])

  if (!platform || !url) return null

  return (
    <>
      <button
        onClick={toggle}
        disabled={!ready}
        aria-label={playing ? 'Pausar' : 'Reproducir'}
        title={playing ? 'Pausar' : 'Reproducir'}
        className="flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-wait"
      >
        {playing ? <Pause size={size} weight="fill" /> : <Play size={size} weight="fill" />}
      </button>

      {/* Real widget, mounted but clipped to 0x0 — audio plays regardless of visible size */}
      <div aria-hidden className="absolute w-0 h-0 overflow-hidden pointer-events-none">
        {(platform === 'soundcloud' || platform === 'mixcloud') && (
          <iframe
            ref={iframeRef}
            src={toEmbedUrl(url, platform)}
            width="300"
            height="166"
            allow="autoplay"
            title="Reproductor fijo"
          />
        )}
        {platform === 'spotify' && <div ref={spotifyDivRef} />}
      </div>
    </>
  )
}
