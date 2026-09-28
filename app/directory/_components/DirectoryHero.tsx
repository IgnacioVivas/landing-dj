export default function DirectoryHero({ count }: { count: number }) {
  return (
    <section className="relative px-4 pt-40 pb-16 text-center overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="relative z-10 max-w-3xl mx-auto">
        <p className="font-mono text-xs tracking-[0.3em] uppercase mb-6" style={{ color: '#8b5cf6' }}>
          Hypear Agency
        </p>
        <h1
          className="font-display leading-none tracking-tight mb-6"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          Nuestros DJs
        </h1>
        <p className="font-body text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
          {count} artista{count !== 1 ? 's' : ''} representados por la agencia. Descubrí su música,
          sus próximos shows y contactalos para tu próximo evento.
        </p>
      </div>
    </section>
  )
}
