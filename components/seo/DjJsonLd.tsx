type Props = {
  name: string
  url: string
  image: string | null
  description: string
  genres: string[]
  sameAs: string[]
}

// schema.org MusicGroup — tells Google this page represents a performing
// artist, not a generic business page, and gives it the social profiles to
// cross-reference for the knowledge panel.
export default function DjJsonLd({ name, url, image, description, genres, sameAs }: Props) {
  const data = {
    '@context': 'https://schema.org',
    '@type':    'MusicGroup',
    name,
    url,
    description,
    ...(image           && { image }),
    ...(genres.length    > 0 && { genre: genres }),
    ...(sameAs.length    > 0 && { sameAs }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
