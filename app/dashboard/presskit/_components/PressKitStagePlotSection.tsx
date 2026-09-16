'use client'

import PhotoUploader from '@/app/dashboard/settings/_components/PhotoUploader'
import { updatePressKitStagePlotAction } from '../actions'

export default function PressKitStagePlotSection({ initialUrl }: { initialUrl: string | null }) {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <h3 className="font-display text-2xl text-white tracking-wider mb-1">Esquema de escenario</h3>
        <p className="font-mono text-xs text-slate-500">
          Subí una imagen con el layout de equipos en el escenario (foto o diagrama). Opcional.
        </p>
      </div>

      <PhotoUploader
        label="Esquema de escenario"
        initialUrl={initialUrl}
        onSave={updatePressKitStagePlotAction}
        aspect="aspect-video"
        objectFit="contain"
      />
    </section>
  )
}
