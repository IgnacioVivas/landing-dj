import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getShowsByUser } from '@/lib/queries/shows'
import { db } from '@/lib/db'
import ShowList from './_components/ShowList'

export const metadata = { title: 'Shows — DJ Panel' }

export default async function ShowsPage() {
  const session = await auth()
  if (!session?.user.id) redirect('/login')

  const [shows, settings] = await Promise.all([
    getShowsByUser(session.user.id),
    db.djSettings.findUnique({
      where:  { userId: session.user.id },
      select: { showsMode: true },
    }),
  ])

  const showsMode = (settings?.showsMode ?? 'list') as 'list' | 'flyer'

  return <ShowList shows={shows} showsMode={showsMode} />
}
