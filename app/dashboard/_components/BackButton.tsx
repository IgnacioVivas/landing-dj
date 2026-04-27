'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from '@phosphor-icons/react'

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/dashboard')}
      className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors mb-6 font-mono text-xs"
    >
      <ArrowLeft size={14} />
      Dashboard
    </button>
  )
}
