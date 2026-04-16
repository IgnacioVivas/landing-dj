'use client'

import { YoutubeLogo } from '@phosphor-icons/react'
import { djConfig } from '@/lib/config'
import { useLanguage } from '@/contexts/LanguageContext'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'
import GlowButton from '@/components/ui/GlowButton'

export default function YouTube() {
  const { t } = useLanguage()
  const { featuredVideoId, channelUrl } = djConfig.youtube

  return (
    <section id="youtube" className="py-24 md:py-32 bg-[#07070f]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-12">
          <SectionHeading
            overline={t.youtube.overline}
            title={t.youtube.title}
            description={t.youtube.description}
            align="center"
          />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div
            className="relative w-full aspect-video rounded-2xl overflow-hidden"
            style={{
              boxShadow: '0 0 80px rgba(139, 92, 246, 0.15), 0 0 20px rgba(0,0,0,0.8)',
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${featuredVideoId}?rel=0&modestbranding=1`}
              title={`${djConfig.name} — DJ Set`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0 rounded-2xl"
            />
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="flex justify-center mt-8">
          <GlowButton href={channelUrl} variant="outline">
            <YoutubeLogo size={18} weight="fill" className="text-red-500" />
            {t.youtube.cta}
          </GlowButton>
        </AnimatedSection>
      </div>
    </section>
  )
}
