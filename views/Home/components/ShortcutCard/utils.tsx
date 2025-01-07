export function convertDurationToText(duration: number, summarized: boolean = false): string {
  if (duration === 9007199254740991) {
    return 'Filtered Tasks'
  }
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60

  const hoursText = hours === 0 ? '' : summarized ? hours.toString() + 'h' : hours === 1 ? '1 hour' : `${hours} hours`
  const minutesText = minutes === 0 ? '' : summarized ? minutes.toString() + 'm' : minutes === 1 ? '1 minute' : `${minutes} minutes`

  return [hoursText, minutesText].filter((value) => value !== '').join(summarized ? ' ' : ', ')
}
