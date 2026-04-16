'use client'

import {
  InstagramLogo,
  SpotifyLogo,
  SoundcloudLogo,
  YoutubeLogo,
} from '@phosphor-icons/react'
import { djConfig } from '@/lib/config'
import { useLanguage } from '@/contexts/LanguageContext'

const socialLinks = [
  { icon: InstagramLogo, href: djConfig.social.instagram, label: 'Instagram' },
  { icon: SpotifyLogo,   href: djConfig.social.spotify,   label: 'Spotify' },
  { icon: SoundcloudLogo,href: djConfig.social.soundcloud,label: 'SoundCloud' },
  { icon: YoutubeLogo,   href: djConfig.social.youtube,   label: 'YouTube' },
]

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 bg-[#07070f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <span className="font-display text-xl text-white tracking-wider">
          {djConfig.name}
        </span>

        <div className="flex items-center gap-5">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-slate-500 hover:text-violet-400 transition-colors"
            >
              <Icon size={20} />
            </a>
          ))}
        </div>

        <p className="font-mono text-xs text-slate-600">
          © {year} {djConfig.name}. {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
