import { auth } from '@/auth'
import { db } from '@/lib/db'
import DashboardCards from './_components/DashboardCards'

export default async function DashboardPage() {
  const session = await auth()
  const userId  = session!.user.id

  const [upcomingShows, releases, gallery, totalViews] = await Promise.all([
    db.show.count({ where: { userId, isPast: false } }),
    db.release.count({ where: { userId } }),
    db.galleryItem.count({ where: { userId } }),
    db.pageView.count({ where: { userId } }),
  ])

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

      <DashboardCards counts={{ upcomingShows, releases, gallery, totalViews }} />
    </div>
  )
}
