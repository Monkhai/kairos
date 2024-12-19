export function convertDurationToText(duration: number): string {
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60

  if (hours === 1 && minutes === 0) {
    return '1 hour'
  }

  if (hours === 1 && minutes > 0) {
    return `1 hour, ${minutes} minutes`
  }

  if (hours > 1 && minutes === 0) {
    return `${hours} hours`
  }

  if (hours > 1 && minutes > 0) {
    return `${hours} hours, ${minutes} minutes`
  }

  if (hours === 0 && minutes > 0) {
    return `${minutes} minutes`
  }

  return '1 minute'
}
