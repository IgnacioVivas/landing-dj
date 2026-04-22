import { Suspense } from 'react'
import LoginForm from './_components/LoginForm'

export const metadata = {
  title: 'Acceso — DJ Panel',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07070f] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-white tracking-widest mb-2">
            DJ PANEL
          </h1>
          <p className="font-mono text-xs text-slate-600 tracking-widest">
            ACCESO PRIVADO
          </p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
