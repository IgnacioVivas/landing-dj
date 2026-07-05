import { auth } from '@/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import BackButton from '@/app/dashboard/_components/BackButton'
import EmailSection from './_components/EmailSection'
import PasswordSection from './_components/PasswordSection'

export const metadata = { title: 'Cuenta — DJ Panel' }

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user.id) redirect('/login')

  const user = await db.user.findUnique({
    where:  { id: session.user.id },
    select: { email: true },
  })
  if (!user) redirect('/login')

  return (
    <div>
      <BackButton />

      <div className="mb-10">
        <h2 className="font-display text-4xl text-white tracking-wider mb-1">
          Cuenta
        </h2>
        <p className="font-mono text-xs text-slate-500">
          Datos de acceso al dashboard — email y contraseña.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        <EmailSection currentEmail={user.email} />
        <div className="pt-10 border-t border-white/5">
          <PasswordSection />
        </div>
      </div>
    </div>
  )
}
