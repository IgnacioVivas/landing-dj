import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getShowsByUser } from '@/lib/queries/shows'
import ShowList from './_components/ShowList'

export const metadata = { title: 'Shows — DJ Panel' }

export default async function ShowsPage() {
  const session = await auth()
  if (!session?.user.id) redirect('/login')

  const shows = await getShowsByUser(session.user.id)

  return <ShowList shows={shows} />
}
