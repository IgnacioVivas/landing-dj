import { InstagramLogo, SpotifyLogo, SoundcloudLogo, YoutubeLogo } from '@phosphor-icons/react'

type Social = {
  instagram:  string | null
  spotify:    string | null
  soundcloud: string | null
  youtube:    string | null
}

export default function HeroSocialLinks({ social, size = 20 }: { social: Social; size?: number }) {
  const links = [
    { url: social.instagram,  Icon: InstagramLogo,  label: 'Instagram' },
    { url: social.spotify,    Icon: SpotifyLogo,    label: 'Spotify' },
    { url: social.soundcloud, Icon: SoundcloudLogo, label: 'SoundCloud' },
    { url: social.youtube,    Icon: YoutubeLogo,    label: 'YouTube' },
  ].filter(s => s.url)

  if (!links.length) return null

  return (
    <div className="flex items-center gap-3">
      {links.map(({ url, Icon, label }) => (
        <a
          key={label}
          href={url!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-slate-500 hover:text-white transition-colors"
        >
          <Icon size={size} />
        </a>
      ))}
    </div>
  )
}
