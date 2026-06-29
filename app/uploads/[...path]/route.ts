import { createReadStream, existsSync, statSync } from 'fs'
import { join, extname } from 'path'
import { NextRequest, NextResponse } from 'next/server'

const MIME: Record<string, string> = {
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.mp4':  'video/mp4',
  '.mov':  'video/quicktime',
  '.webm': 'video/webm',
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const filePath = join(process.cwd(), 'public', 'uploads', ...path)

  if (!existsSync(filePath)) {
    return new NextResponse('Not found', { status: 404 })
  }

  const ext  = extname(filePath).toLowerCase()
  const mime = MIME[ext] ?? 'application/octet-stream'
  const size = statSync(filePath).size
  const range = req.headers.get('range')

  if (range) {
    const [startStr, endStr] = range.replace(/bytes=/, '').split('-')
    const start     = parseInt(startStr, 10)
    const end       = endStr ? parseInt(endStr, 10) : size - 1
    const chunkSize = end - start + 1
    const stream    = ReadableStream.from(createReadStream(filePath, { start, end }))
    return new NextResponse(stream, {
      status: 206,
      headers: {
        'Content-Range':  `bytes ${start}-${end}/${size}`,
        'Accept-Ranges':  'bytes',
        'Content-Length': String(chunkSize),
        'Content-Type':   mime,
      },
    })
  }

  const stream = ReadableStream.from(createReadStream(filePath))
  return new NextResponse(stream, {
    headers: {
      'Content-Type':   mime,
      'Content-Length': String(size),
      'Accept-Ranges':  'bytes',
      'Cache-Control':  'public, max-age=31536000, immutable',
    },
  })
}
