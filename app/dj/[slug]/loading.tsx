export default function Loading() {
  return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center">
      {/* Background orbs — CSS only, no JS needed */}
      <div
        className="orb-1 absolute top-[15%] left-[10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'var(--dj-purple-dim)', filter: 'blur(120px)' }}
      />
      <div
        className="orb-2 absolute bottom-[10%] right-[8%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'var(--dj-cyan-dim)', filter: 'blur(100px)' }}
      />

      {/* Vinyl spinner */}
      <div className="relative flex items-center justify-center w-20 h-20">
        {/* Outer spinning ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: '#8b5cf6', animationDuration: '1s' }}
        />
        {/* Static groove rings */}
        <div className="absolute inset-[6px]  rounded-full border border-white/5" />
        <div className="absolute inset-[12px] rounded-full border border-white/5" />
        {/* Center dot */}
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#8b5cf6', opacity: 0.6 }} />
      </div>
    </div>
  )
}
