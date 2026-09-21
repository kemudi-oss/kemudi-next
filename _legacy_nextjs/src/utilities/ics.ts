interface GenerateICSProps {
  providerName: string
  clientName: string
  serviceName: string
  date: string
  time: string
  durationMinutes?: number
}

export function generateICS({
  providerName,
  clientName,
  serviceName,
  date,
  time,
  durationMinutes = 60,
}: GenerateICSProps): string {
  const start = parseDateTime(date, time)
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000)

  const formatDT = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

  const uid = `kemudi-${Date.now()}-${Math.random().toString(36).slice(2)}@kemudi.com`

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kemudi//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART:${formatDT(start)}`,
    `DTEND:${formatDT(end)}`,
    `SUMMARY:Therapy session with ${providerName}`,
    `DESCRIPTION:Your ${serviceName} with ${providerName}.\\nBooked via Kemudi.`,
    'STATUS:CONFIRMED',
    `ORGANIZER;CN=${providerName}:noreply@kemudi.com`,
    `ATTENDEE;CN=${clientName}:mailto:noreply@kemudi.com`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

function parseDateTime(date: string, time: string): Date {
  const dateStr = date.trim()
  const timeStr = time.trim()

  const combined = `${dateStr} ${timeStr}`
  const parsed = new Date(combined)

  if (!isNaN(parsed.getTime())) {
    return parsed
  }

  return new Date()
}
