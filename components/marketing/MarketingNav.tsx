import Link from 'next/link'

export default function MarketingNav() {
  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4"
      style={{ background: 'rgba(7,7,15,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <Link href="/" className="font-display text-2xl tracking-widest text-white">HYPEK</Link>
      <Link
        href="/login"
        className="font-mono text-xs tracking-widest uppercase px-5 py-2.5 rounded-lg transition-colors"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' }}
      >
        Ingresar
      </Link>
    </nav>
  )
}
