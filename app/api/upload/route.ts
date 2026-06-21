import { createWriteStream, mkdirSync } from 'fs'
import { join } from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const filename    = request.headers.get('x-filename') ?? 'file'
  const ext         = filename.split('.').pop()?.toLowerCase() ?? 'bin'
  const userId      = session.user.id
  const dir         = join(process.cwd(), 'public', 'uploads', userId)

  mkdirSync(dir, { recursive: true })

  const newFilename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const filepath    = join(dir, newFilename)
  const writeStream = createWriteStream(filepath)
  const reader      = request.body!.getReader()

  await new Promise<void>((resolve, reject) => {
    function pump() {
      reader.read().then(({ done, value }) => {
        if (done) { writeStream.end(); resolve(); return }
        writeStream.write(value, err => { if (err) reject(err); else pump() })
      }).catch(reject)
    }
    pump()
  })

  return NextResponse.json({ url: `/uploads/${userId}/${newFilename}` })
}
