/** Quiet hours: no marketing SMS outside 9:00–20:00 in business timezone. */
export function isWithinQuietHours(
  date: Date,
  timeZone: string,
  startHour = 9,
  endHour = 20,
): boolean {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone,
    }).format(date),
  )
  return hour >= startHour && hour < endHour
}

export function nextQuietWindow(date: Date, timeZone: string, startHour = 9): Date {
  // Approximate: add hours until we hit startHour in that timezone.
  let cursor = new Date(date)
  for (let i = 0; i < 48; i += 1) {
    cursor = new Date(cursor.getTime() + 60 * 60 * 1000)
    if (isWithinQuietHours(cursor, timeZone, startHour, startHour + 1)) return cursor
  }
  return new Date(date.getTime() + 12 * 60 * 60 * 1000)
}
