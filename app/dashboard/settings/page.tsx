import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getUserSettings } from '@/lib/queries/user'
import SettingsForm from './_components/SettingsForm'
import PasswordSection from './_components/PasswordSection'
import BackButton from '@/app/dashboard/_components/BackButton'

export const metadata = { title: 'Configuración — DJ Panel' }

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user.id) redirect('/login')

  const data = await getUserSettings(session.user.id)
  if (!data) redirect('/login')

  return (
    <div>
      <BackButton />
      <div className="mb-10">
        <h2 className="font-display text-4xl text-white tracking-wider mb-1">
          Configuración
        </h2>
        <p className="font-mono text-xs text-slate-500">
          Todo lo que aparece en tu landing page.
        </p>
      </div>

      <SettingsForm data={data} />

      <div className="mt-16 pt-10 border-t border-white/5">
        <PasswordSection />
      </div>
    </div>
  )
}
