import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { auth } from '@/auth'

const f = createUploadthing()

const authMiddleware = async () => {
  const session = await auth()
  if (!session?.user.id) throw new Error('Unauthorized')
  return { userId: session.user.id }
}

const onComplete = async ({ file }: { file: { ufsUrl: string; key: string } }) =>
  ({ ufsUrl: file.ufsUrl, key: file.key })

export const ourFileRouter = {
  galleryImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authMiddleware)
    .onUploadComplete(onComplete),

  djPhoto: f({ image: { maxFileSize: '8MB', maxFileCount: 1 } })
    .middleware(authMiddleware)
    .onUploadComplete(onComplete),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
