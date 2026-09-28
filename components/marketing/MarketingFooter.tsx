export default function MarketingFooter() {
  return (
    <footer className="py-8 px-4 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <p className="font-mono text-xs text-slate-700">
        © {new Date().getFullYear()} Hypear Agency · hypear.agency@gmail.com
      </p>
    </footer>
  )
}
