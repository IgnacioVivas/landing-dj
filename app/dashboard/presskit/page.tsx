import { auth } from '@/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import BackButton from '@/app/dashboard/_components/BackButton'
import PressKitPasswordSection from './_components/PressKitPasswordSection'

export const metadata = { title: 'Press Kit — DJ Panel' }

export default async function PressKitPage() {
  const session = await auth()
  if (!session?.user.id) redirect('/login')

  const settings = await db.djSettings.findUnique({
    where:  { userId: session.user.id },
    select: { pressKitPassword: true },
  })

  return (
    <div>
      <BackButton />

      <div className="mb-10">
        <h2 className="font-display text-4xl text-white tracking-wider mb-1">
          Press Kit
        </h2>
        <p className="font-mono text-xs text-slate-500">
          Gestioná el acceso y la protección de los archivos de prensa.
        </p>
      </div>

      <PressKitPasswordSection initialPassword={settings?.pressKitPassword ?? null} />
    </div>
  )
}
