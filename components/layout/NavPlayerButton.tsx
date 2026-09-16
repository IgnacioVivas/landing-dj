'use client'

import { useEffect, useSyncExternalStore, useCallback, useId } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Play, Pause } from '@phosphor-icons/react'
import { useDjData } from '@/lib/dj-context'
import { detectEmbeddablePlatform, toEmbedUrl, toSpotifyUri, MUSIC_PLATFORM_LABEL } from '@/lib/music-platforms'

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
type PlayerController = SoundCloudWidget | MixcloudWidget | SpotifyController

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

// Module-level store shared by every mounted instance of this component —
// the desktop and mobile nav rows both render one. Without a shared owner,
// the second instance to mount would overwrite Spotify's single global
// `onSpotifyIframeApiReady` callback before the first instance's iframe
// ever got its controller, leaving that button stuck waiting forever.
// Only the first instance to run actually creates the widget; every
// instance (including that one) just reads/controls this shared state.
let ownerUrl: string | null = null
let controller: PlayerController | null = null
let state = { ready: false, playing: false }
const listeners = new Set<() => void>()

function setState(patch: Partial<typeof state>) {
  state = { ...state, ...patch }
  listeners.forEach(l => l())
}
function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
function getSnapshot() { return state }

function initPlayer(url: string, platform: 'soundcloud' | 'spotify' | 'mixcloud', iframe: HTMLIFrameElement | null, spotifyHost: HTMLElement | null) {
  if (ownerUrl === url) return // another instance already owns this URL
  ownerUrl = url
  controller = null
  setState({ ready: false, playing: false })

  if (platform === 'soundcloud' && iframe) {
    loadScript('https://w.soundcloud.com/player/api.js').then(() => {
      if (ownerUrl !== url || !window.SC) return
      const widget = window.SC.Widget(iframe)
      controller = widget
      widget.bind(window.SC.Widget.Events.READY,  () => setState({ ready: true }))
      widget.bind(window.SC.Widget.Events.PLAY,   () => setState({ playing: true }))
      widget.bind(window.SC.Widget.Events.PAUSE,  () => setState({ playing: false }))
      widget.bind(window.SC.Widget.Events.FINISH, () => setState({ playing: false }))
    }).catch(() => {})
  }

  if (platform === 'mixcloud' && iframe) {
    loadScript('https://widget.mixcloud.com/media/js/widgetApi.js').then(() => {
      if (ownerUrl !== url || !window.Mixcloud) return
      const widget = window.Mixcloud.PlayerWidget(iframe)
      widget.ready.then(() => {
        if (ownerUrl !== url) return
        controller = widget
        setState({ ready: true })
        widget.events.play.on(()  => setState({ playing: true }))
        widget.events.pause.on(() => setState({ playing: false }))
        widget.events.ended.on(() => setState({ playing: false }))
      })
    }).catch(() => {})
  }

  if (platform === 'spotify' && spotifyHost) {
    const uri = toSpotifyUri(url)
    if (!uri) return
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      if (ownerUrl !== url) return
      IFrameAPI.createController(spotifyHost, { uri, width: '300', height: '80' }, (c) => {
        if (ownerUrl !== url) return
        controller = c
        setState({ ready: true })
        c.addListener('playback_update', (e) => setState({ playing: !e.data.isPaused }))
      })
    }
    loadScript('https://open.spotify.com/embed/iframe-api/v1').catch(() => {})
  }
}

function toggle() {
  if (!controller) return
  if ('togglePlay' in controller) controller.togglePlay()
  else if (state.playing) controller.pause()
  else controller.play()
}

// Filled accent-colored play/pause pinned to the nav, next to the social
// icons / Book Now button. No autoplay-on-arrival (browsers block it, and
// Spotify's embed doesn't offer it either) — the pulsing ring invites the
// one click that's needed instead. The real widget is mounted but visually
// clipped to 0x0; this button only drives it through each platform's JS API.
export default function NavPlayerButton({ size = 16 }: { size?: number }) {
  const { mix } = useDjData()
  const url      = mix.pinnedUrl
  const platform = url ? detectEmbeddablePlatform(url) : null
  const reactId  = useId()
  const title    = mix.pinnedTitle || (platform ? MUSIC_PLATFORM_LABEL[platform] : null)

  const { ready, playing } = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  useEffect(() => {
    if (!platform || !url) return
    const iframe     = document.getElementById(`nav-player-iframe-${reactId}`) as HTMLIFrameElement | null
    const spotifyHost = document.getElementById(`nav-player-spotify-${reactId}`)
    initPlayer(url, platform, iframe, spotifyHost)
  }, [platform, url, reactId])

  const handleClick = useCallback(() => toggle(), [])

  if (!platform || !url) return null

  return (
    <>
      <motion.button
        onClick={handleClick}
        disabled={!ready}
        aria-label={playing ? 'Pausar' : 'Reproducir'}
        title={title ?? (playing ? 'Pausar' : 'Reproducir')}
        whileHover={ready ? { scale: 1.03 } : undefined}
        whileTap={ready ? { scale: 0.97 } : undefined}
        className="flex items-center gap-2 pl-1 pr-3 h-9 max-w-[200px] rounded-full text-white glow-accent transition-opacity disabled:opacity-60"
        style={{ backgroundColor: 'var(--dj-accent)' }}
      >
        <span className="relative flex items-center justify-center w-7 h-7 rounded-full shrink-0">
          {/* Attention pulse while idle and ready to play */}
          <AnimatePresence>
            {ready && !playing && (
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: 'var(--dj-accent)' }}
                initial={{ opacity: 0.5, scale: 1 }}
                animate={{ opacity: 0, scale: 1.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>

          {!ready ? (
            <motion.span
              className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          ) : playing ? (
            <Pause size={size} weight="fill" />
          ) : (
            <Play size={size} weight="fill" className="translate-x-[1px]" />
          )}
        </span>

        {title && (
          <span className="hidden sm:inline font-body text-xs text-white/90 truncate">
            {title}
          </span>
        )}
      </motion.button>

      {/* Real widget, mounted but clipped to 0x0 — audio plays regardless of visible size */}
      <div aria-hidden className="absolute w-0 h-0 overflow-hidden pointer-events-none">
        {(platform === 'soundcloud' || platform === 'mixcloud') && (
          <iframe
            id={`nav-player-iframe-${reactId}`}
            src={toEmbedUrl(url, platform)}
            width="300"
            height="166"
            allow="autoplay"
            title="Reproductor fijo"
          />
        )}
        {platform === 'spotify' && <div id={`nav-player-spotify-${reactId}`} />}
      </div>
    </>
  )
}
