import { unlink } from 'fs/promises'
import { join } from 'path'

export async function deleteFile(url: string | null | undefined) {
  if (!url?.startsWith('/uploads/')) return
  try {
    await unlink(join(process.cwd(), 'public', url))
  } catch { /* file may not exist */ }
}
