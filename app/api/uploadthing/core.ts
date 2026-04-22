import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { auth } from '@/auth'

const f = createUploadthing()

export const ourFileRouter = {
  galleryImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth()
      if (!session?.user.id) throw new Error('Unauthorized')
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ file }) => {
      return { ufsUrl: file.ufsUrl, key: file.key }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
