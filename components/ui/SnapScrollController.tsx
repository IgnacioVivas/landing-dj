'use client'

import { useEffect } from 'react'
import { useDjData } from '@/lib/dj-context'

export default function SnapScrollController() {
  const { scrollMode } = useDjData()

  useEffect(() => {
    if (scrollMode !== 'snap') return

    let isAnimating = false
    let touchStartY = 0

    function getSections() {
      return Array.from(document.querySelectorAll<HTMLElement>('main > section'))
    }

    function getActiveIndex() {
      const sections = getSections()
      const mid = window.scrollY + window.innerHeight / 2
      let best = 0
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= mid) best = i
      }
      return best
    }

    function goTo(index: number) {
      const sections = getSections()
      if (index < 0 || index >= sections.length || isAnimating) return
      isAnimating = true
      sections[index].scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => { isAnimating = false }, 900)
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault()
      if (isAnimating) return
      const current = getActiveIndex()
      goTo(e.deltaY > 0 ? current + 1 : current - 1)
    }

    function onKeyDown(e: KeyboardEvent) {
      const tag = (document.activeElement as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        if (!isAnimating) goTo(getActiveIndex() + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        if (!isAnimating) goTo(getActiveIndex() - 1)
      }
    }

    function onTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY
    }

    function onTouchEnd(e: TouchEvent) {
      if (isAnimating) return
      const delta = touchStartY - e.changedTouches[0].clientY
      if (Math.abs(delta) < 50) return
      goTo(delta > 0 ? getActiveIndex() + 1 : getActiveIndex() - 1)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [scrollMode])

  return null
}
