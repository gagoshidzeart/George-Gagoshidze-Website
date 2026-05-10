import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, artwork } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const subject = artwork
      ? `Enquiry about "${artwork}" — from ${name}`
      : `Contact form message from ${name}`

    const body = [
      artwork ? `Artwork: ${artwork}` : null,
      `From: ${name} <${email}>`,
      '',
      message,
    ]
      .filter(Boolean)
      .join('\n')

    await resend.emails.send({
      from: 'website@georgegagoshidze.com',
      to: process.env.ADMIN_EMAIL!,
      replyTo: email,
      subject,
      text: body,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact email error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
