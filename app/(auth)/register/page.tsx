import RegisterForm from './_components/RegisterForm'

export const metadata = {
  title: 'Crear cuenta — DJ Panel',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07070f] px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-white tracking-widest mb-2">
            DJ PANEL
          </h1>
          <p className="font-mono text-xs text-slate-600 tracking-widest">
            NUEVA CUENTA
          </p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
