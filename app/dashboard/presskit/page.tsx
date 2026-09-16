import { auth } from '@/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import BackButton from '@/app/dashboard/_components/BackButton'
import PressKitLinksSection from './_components/PressKitLinksSection'
import PressKitPasswordSection from './_components/PressKitPasswordSection'
import PressKitDetailsSection from './_components/PressKitDetailsSection'
import PressKitStagePlotSection from './_components/PressKitStagePlotSection'

export const metadata = { title: 'Press Kit — DJ Panel' }

export default async function PressKitPage() {
  const session = await auth()
  if (!session?.user.id) redirect('/login')

  const settings = await db.djSettings.findUnique({
    where:  { userId: session.user.id },
    select: {
      pressKitPassword: true, riderUrl: true, epkUrl: true,
      pressKitEquipment: true, pressKitMonitoring: true, pressKitErgonomics: true, pressKitHospitality: true,
      pressKitStagePlotUrl: true, pressKitPromoFolderUrl: true,
    },
  })

  return (
    <div>
      <BackButton />

      <div className="mb-10">
        <h2 className="font-display text-4xl text-white tracking-wider mb-1">
          Press Kit
        </h2>
        <p className="font-mono text-xs text-slate-500">
          Gestioná los archivos de prensa y su acceso.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        <PressKitLinksSection
          initialRiderUrl={settings?.riderUrl ?? null}
          initialEpkUrl={settings?.epkUrl ?? null}
          initialPromoFolderUrl={settings?.pressKitPromoFolderUrl ?? null}
        />
        <div className="pt-10 border-t border-white/5">
          <PressKitDetailsSection
            initialEquipment={settings?.pressKitEquipment ?? ''}
            initialMonitoring={settings?.pressKitMonitoring ?? ''}
            initialErgonomics={settings?.pressKitErgonomics ?? ''}
            initialHospitality={settings?.pressKitHospitality ?? ''}
          />
        </div>
        <div className="pt-10 border-t border-white/5">
          <PressKitStagePlotSection initialUrl={settings?.pressKitStagePlotUrl ?? null} />
        </div>
        <div className="pt-10 border-t border-white/5">
          <PressKitPasswordSection initialPassword={settings?.pressKitPassword ?? null} />
        </div>
      </div>
    </div>
  )
}
