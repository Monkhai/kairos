import { GoogleSignin } from '@react-native-google-signin/google-signin'

export async function signinGoogle() {
  await GoogleSignin.hasPlayServices()
  const userInfo = await GoogleSignin.signIn()
  const idToken = userInfo.data!.idToken
  if (!idToken) throw new Error('Failed to get access token')
}

export function isSignedInToGoogle() {
  const a = GoogleSignin.getCurrentUser()
  return !!a
}

export async function getGoogleCalendarEvents() {
  if (!isSignedInToGoogle()) {
    await signinGoogle()
  }

  const { accessToken } = await GoogleSignin.getTokens()

  const now = new Date()
  const tomrrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  const timeMin = now.toISOString()
  const timeMax = tomrrow.toISOString()

  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = (await response.json()) as { items: Array<Event>; error?: string }

  if (response.ok) {
    return data.items
  } else {
    throw new Error(data.error)
  }
}

type Event = {
  kind: 'calendar#event'
  id: string
  status: string
  created: string // utc
  updated: string // utc
  description: string
  summary: string
  start: {
    dateTime: string // utc
    timeZone: string // utc
  }
  end: {
    dateTime: string
    timeZone: string
  }
  endTimeUnspecified: boolean
  recurrence: [string]
  recurringEventId: string
  transparency: string
  visibility: string
  colorId: string
}
