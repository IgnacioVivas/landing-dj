import type { Release, Show, GalleryItem } from './types'

export const djConfig = {
  name: 'NEXUS',
  tagline: 'Electronic Music Producer & DJ',
  genres: ['Tech House', 'Techno', 'Electronic'],

  bio: {
    short:
      'Una fuerza de la música electrónica que ha recorrido los mejores clubes del mundo.',
    full: 'Con más de una década sobre los escenarios más importantes del planeta, NEXUS ha forjado un sonido único que fusiona lo oscuro del techno con la energía del tech house. Formado en los clubes underground de Buenos Aires, su trayectoria lo llevó a residencias en Ibiza, giras por Europa y actuaciones en los principales festivales de Latinoamérica. Su producción musical, distribuida en sellos como Drumcode y Afterlife, refleja una visión artística coherente: música profunda, poderosa y honesta.',
    photo: '/images/bio.jpg',
    stats: [
      { label: 'Años activo', value: '12+' },
      { label: 'Shows', value: '600+' },
      { label: 'Países', value: '25+' },
      { label: 'Releases', value: '60+' },
    ],
  },

  social: {
    instagram: 'https://instagram.com/nexusdj',
    spotify: 'https://open.spotify.com/',
    soundcloud: 'https://soundcloud.com/',
    youtube: 'https://youtube.com/@nexusdj',
    beatport: 'https://beatport.com/',
  },

  releases: [
    {
      id: '1',
      title: 'DARK MATTER',
      year: 2024,
      type: 'album',
      label: 'Drumcode',
      coverGradient: 'linear-gradient(135deg, #0d0221 0%, #300060 50%, #6d00cc 100%)',
      links: { spotify: '#', beatport: '#', soundcloud: '#' },
    },
    {
      id: '2',
      title: 'RESONANCE',
      year: 2024,
      type: 'ep',
      label: 'Afterlife',
      coverGradient: 'linear-gradient(135deg, #001628 0%, #00486e 50%, #00a6e0 100%)',
      links: { spotify: '#', beatport: '#' },
    },
    {
      id: '3',
      title: 'VOID',
      year: 2023,
      type: 'single',
      label: 'Drumcode',
      coverGradient: 'linear-gradient(135deg, #120020 0%, #3d0050 50%, #a000cc 100%)',
      links: { spotify: '#', beatport: '#', soundcloud: '#' },
    },
    {
      id: '4',
      title: 'FREQUENCIES',
      year: 2023,
      type: 'album',
      label: 'FFRR',
      coverGradient: 'linear-gradient(135deg, #001a0d 0%, #00502a 50%, #00cc6a 100%)',
      links: { spotify: '#', appleMusic: '#', beatport: '#' },
    },
    {
      id: '5',
      title: 'SUBZERO',
      year: 2022,
      type: 'ep',
      label: 'Drumcode',
      coverGradient: 'linear-gradient(135deg, #0a0010 0%, #1a003d 50%, #4b0082 100%)',
      links: { spotify: '#', beatport: '#' },
    },
  ] as Release[],

  shows: [
    {
      id: '1',
      date: '2026-05-10',
      city: 'Buenos Aires',
      country: 'Argentina',
      venue: 'Mandarine Park',
      festival: 'Ultra Music Festival',
      ticketUrl: '#',
    },
    {
      id: '2',
      date: '2026-05-24',
      city: 'São Paulo',
      country: 'Brasil',
      venue: 'Green Valley',
      ticketUrl: '#',
    },
    {
      id: '3',
      date: '2026-06-07',
      city: 'Ibiza',
      country: 'España',
      venue: 'Hi Ibiza',
      ticketUrl: '#',
      isSoldOut: true,
    },
    {
      id: '4',
      date: '2026-06-21',
      city: 'Berlin',
      country: 'Alemania',
      venue: 'Berghain',
      ticketUrl: '#',
    },
    {
      id: '5',
      date: '2026-07-05',
      city: 'Bogotá',
      country: 'Colombia',
      venue: 'Club Kabare',
      ticketUrl: '#',
    },
    {
      id: '6',
      date: '2026-03-15',
      city: 'Córdoba',
      country: 'Argentina',
      venue: 'Club X',
      isPast: true,
    },
    {
      id: '7',
      date: '2026-02-08',
      city: 'Madrid',
      country: 'España',
      venue: 'Fabrik',
      isPast: true,
    },
    {
      id: '8',
      date: '2026-01-20',
      city: 'Medellín',
      country: 'Colombia',
      venue: 'Vintrash',
      isPast: true,
    },
  ] as Show[],

  gallery: [
    {
      id: '1',
      gradient: 'linear-gradient(160deg, #0a001a 0%, #1a0050 60%, #3a0080 100%)',
      caption: 'Berghain, Berlín 2025',
      aspect: 'portrait',
    },
    {
      id: '2',
      gradient: 'linear-gradient(160deg, #001220 0%, #003560 60%, #0060a0 100%)',
      caption: 'Hi Ibiza, España 2025',
      aspect: 'landscape',
    },
    {
      id: '3',
      gradient: 'linear-gradient(160deg, #100020 0%, #300060 60%, #5000a0 100%)',
      caption: 'Green Valley, Brasil 2025',
      aspect: 'square',
    },
    {
      id: '4',
      gradient: 'linear-gradient(160deg, #080010 0%, #200040 60%, #400080 100%)',
      caption: 'Ultra BA, Argentina 2025',
      aspect: 'portrait',
    },
    {
      id: '5',
      gradient: 'linear-gradient(160deg, #001515 0%, #004040 60%, #007070 100%)',
      caption: 'Fabric, Londres 2024',
      aspect: 'landscape',
    },
    {
      id: '6',
      gradient: 'linear-gradient(160deg, #100015 0%, #2a003d 60%, #4a006e 100%)',
      caption: 'Mandarine Park, BA 2024',
      aspect: 'portrait',
    },
    {
      id: '7',
      gradient: 'linear-gradient(160deg, #001020 0%, #003050 60%, #005090 100%)',
      caption: 'Club Kabare, Colombia 2024',
      aspect: 'square',
    },
    {
      id: '8',
      gradient: 'linear-gradient(160deg, #0a0008 0%, #25001a 60%, #450030 100%)',
      caption: 'Studio Session 2024',
      aspect: 'landscape',
    },
  ] as GalleryItem[],

  youtube: {
    channelUrl: 'https://youtube.com/@nexusdj',
    featuredVideoId: 'dQw4w9WgXcQ',
  },

  instagram: {
    username: '@nexusdj',
    profileUrl: 'https://instagram.com/nexusdj',
  },

  contact: {
    bookingEmail: 'booking@nexusdj.com',
    pressEmail: 'press@nexusdj.com',
  },
}
