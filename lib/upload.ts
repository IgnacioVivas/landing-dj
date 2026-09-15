export async function uploadFile(file: File): Promise<string> {
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'x-filename': file.name },
    body: file,
  })
  if (!res.ok) throw new Error('Error al subir el archivo')
  const data = await res.json()
  return data.url as string
}
