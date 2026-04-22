import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getReleasesByUser } from '@/lib/queries/releases'
import ReleaseList from './_components/ReleaseList'

export const metadata = { title: 'Releases — DJ Panel' }

export default async function ReleasesPage() {
  const session = await auth()
  if (!session?.user.id) redirect('/login')

  const releases = await getReleasesByUser(session.user.id)

  return <ReleaseList releases={releases} />
}
