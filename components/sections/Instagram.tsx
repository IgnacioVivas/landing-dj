'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { InstagramLogo, ArrowSquareOut } from '@phosphor-icons/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDjData } from '@/lib/dj-context'
import type { InstagramPost } from '@/lib/types'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'
import GlowButton from '@/components/ui/GlowButton'

const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #1a0040 0%, #4b0082 100%)',
  'linear-gradient(135deg, #002040 0%, #004080 100%)',
  'linear-gradient(135deg, #200030 0%, #600090 100%)',
  'linear-gradient(135deg, #001530 0%, #003060 100%)',
  'linear-gradient(135deg, #100020 0%, #350060 100%)',
  'linear-gradient(135deg, #001820 0%, #004050 100%)',
]

function PostCard({ post, index }: { post: InstagramPost; index: number }) {
  const src = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url

  return (
    <motion.a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="relative aspect-square rounded-xl overflow-hidden group block"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="Instagram post" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full" style={{ background: PLACEHOLDER_GRADIENTS[index % 6] }} />
      )}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 flex items-center justify-center">
        <ArrowSquareOut size={22} className="text-white" />
      </div>
    </motion.a>
  )
}

function PlaceholderGrid() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {PLACEHOLDER_GRADIENTS.map((gradient, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: i * 0.06 }}
          className="aspect-square rounded-xl overflow-hidden"
          style={{ background: gradient }}
        />
      ))}
    </div>
  )
}

export default function Instagram() {
  const { t } = useLanguage()
  const { instagram } = useDjData()
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/instagram')
      .then((r) => r.json())
      .then((data: { posts: InstagramPost[] }) => {
        setPosts(data.posts ?? [])
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  return (
    <section id="instagram" className="py-24 md:py-32" style={{ background: '#050509' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-12">
          <SectionHeading overline={t.instagram.overline} title={t.instagram.title} align="center" />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          {loaded && posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {posts.slice(0, 6).map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          ) : (
            <PlaceholderGrid />
          )}
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="flex justify-center mt-8">
          <GlowButton href={instagram.profileUrl ?? '#'} variant="outline">
            <InstagramLogo size={18} />
            {instagram.username ? `@${instagram.username}` : 'Instagram'}
          </GlowButton>
        </AnimatedSection>
      </div>
    </section>
  )
}
