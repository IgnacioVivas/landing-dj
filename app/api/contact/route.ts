import { NextRequest, NextResponse } from 'next/server'
import type { ContactFormData } from '@/lib/types'

/**
 * Contact form handler.
 *
 * To send emails, add Resend (recommended) or Nodemailer:
 *   npm install resend
 *
 * Then replace the console.log below with:
 *   const resend = new Resend(process.env.RESEND_API_KEY)
 *   await resend.emails.send({ from, to, subject, html })
 *
 * Required env vars:
 *   RESEND_API_KEY=re_xxxx
 *   CONTACT_TO_EMAIL=youremail@example.com
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactFormData

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // TODO: send email here
    console.log('[Contact form]', body)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
