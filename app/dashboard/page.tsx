import { auth } from '@/auth'
import DashboardCards from './_components/DashboardCards'

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-display text-5xl text-white tracking-wider mb-2">
          Bienvenido, {session?.user.name ?? 'DJ'}
        </h1>
        <p className="font-mono text-sm text-slate-500">
          Desde acá controlás todo el contenido de tu landing page.
        </p>
      </div>

      <DashboardCards />
    </div>
  )
}
