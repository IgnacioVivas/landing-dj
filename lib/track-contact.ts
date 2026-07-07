export type ContactClickType = 'booking' | 'press' | 'other' | 'send_message' | 'booking_contact'

export function trackContactClick(userId: string, type: ContactClickType) {
  fetch('/api/analytics/contact-click', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ userId, type }),
  }).catch(() => null)
}
