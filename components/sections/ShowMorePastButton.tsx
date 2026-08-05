'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function ShowMorePastButton({ onClick }: { onClick: () => void }) {
  const { t } = useLanguage()
  return (
    <button
      onClick={onClick}
      className="font-mono text-xs text-slate-600 hover:text-slate-400 transition-colors mt-4"
    >
      {t.shows.showMorePast} →
    </button>
  )
}
