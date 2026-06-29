import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hypek — Presskits profesionales para DJs',
  description: 'Tu landing page y presskit digital siempre disponibles. Bio, shows, releases, galería, contacto y más. Por Hypear Agency.',
  openGraph: {
    title: 'Hypek — Presskits profesionales para DJs',
    description: 'Tu landing page y presskit digital siempre disponibles. Por Hypear Agency.',
    type: 'website',
  },
}

const features = [
  {
    icon: '🎧',
    title: 'Landing page completa',
    desc: 'Biografía, shows, releases, galería multimedia, mix player y sección de contacto. Todo en un solo lugar.',
  },
  {
    icon: '📁',
    title: 'Press Kit integrado',
    desc: 'Rider técnico y EPK descargables, protegidos con contraseña. Solo los promotores que vos autoricés pueden acceder.',
  },
  {
    icon: '📅',
    title: 'Agenda de shows',
    desc: 'Gestioná tus fechas, flyers y tickets. Countdown automático al próximo show. Mapa de gira mundial.',
  },
  {
    icon: '🎨',
    title: 'Identidad visual propia',
    desc: 'Colores de acento, foto o video de fondo en el hero, layouts y modos de scroll configurables.',
  },
  {
    icon: '🌎',
    title: 'Bilingüe ES / EN',
    desc: 'Tu página en español e inglés con un click. Llegá a promotores de todo el mundo sin esfuerzo.',
  },
  {
    icon: '📊',
    title: 'Analytics de visitas',
    desc: 'Sabé cuántas personas ven tu página, desde qué países y desde qué dispositivos.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#07070f] text-white">

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(7,7,15,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span className="font-display text-2xl tracking-widest text-white">HYPEK</span>
        <Link
          href="/login"
          className="font-mono text-xs tracking-widest uppercase px-5 py-2.5 rounded-lg transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' }}
        >
          Ingresar
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 pt-20">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="font-mono text-xs tracking-[0.3em] uppercase mb-6" style={{ color: '#8b5cf6' }}>
            Por Hypear Agency
          </p>
          <h1 className="font-display leading-none tracking-tight mb-6"
            style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Tu presskit.<br />Siempre listo.
          </h1>
          <p className="font-body text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Landing page y press kit digital profesional para DJs. Bio, shows, releases, galería, contacto y mucho más — todo en un panel fácil de manejar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="font-body font-medium px-8 py-4 rounded-xl text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #22d3ee 100%)', boxShadow: '0 0 30px rgba(139,92,246,0.3)' }}
            >
              Acceder a mi panel
            </Link>
            <a
              href="https://hypearagency.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body font-medium px-8 py-4 rounded-xl text-slate-300 transition-colors hover:text-white"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Conocer Hypear Agency
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-700">
          <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.2))' }} />
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4" style={{ background: '#050509' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-mono text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#8b5cf6' }}>Qué incluye</p>
            <h2 className="font-display text-4xl md:text-5xl tracking-wider text-white">Todo lo que necesitás</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="text-2xl mb-4 block">{f.icon}</span>
                <h3 className="font-body font-semibold text-white mb-2">{f.title}</h3>
                <p className="font-mono text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl tracking-wider text-white mb-4">
            ¿Tenés acceso?
          </h2>
          <p className="font-mono text-sm text-slate-500 mb-10">
            Ingresá a tu panel y gestioná tu presskit desde cualquier lugar.
          </p>
          <Link
            href="/login"
            className="inline-block font-body font-medium px-10 py-4 rounded-xl text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #22d3ee 100%)', boxShadow: '0 0 40px rgba(139,92,246,0.25)' }}
          >
            Ir al panel →
          </Link>
          <p className="font-mono text-xs text-slate-700 mt-6">
            ¿Querés tu presskit?{' '}
            <a href="mailto:hypear.agency@gmail.com" className="text-slate-500 hover:text-slate-300 transition-colors underline">
              Contactanos
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="font-mono text-xs text-slate-700">
          © {new Date().getFullYear()} Hypear Agency · hypear.agency@gmail.com
        </p>
      </footer>

    </div>
  )
}
