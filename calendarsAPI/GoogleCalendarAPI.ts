import { PermissionStatus } from 'expo-calendar'
import { CalendarAPI, CalendarProviders } from './CalenderAPI'
import { Dispatch, SetStateAction, useState } from 'react'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import reactQueryKeyStore from '@/queries/reactQueryKeyStore'

type GoogleCalEvent = {
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

export class GoogleCalendarAPI implements CalendarAPI<GoogleCalEvent> {
  constructor() {
    GoogleSignin.configure({
      iosClientId: '1091622483065-aqe64cov52jmdqqh1uplmqaelk05tlcr.apps.googleusercontent.com',
      scopes: ['https://www.googleapis.com/auth/calendar.events.readonly'],
    })
  }

  private async isSignedIn(): Promise<boolean> {
    const a = GoogleSignin.getCurrentUser()
    return !!a
  }

  private async getPermission(): Promise<boolean> {
    console.log('getPermission')
    await GoogleSignin.hasPlayServices()
    const userInfo = await GoogleSignin.signIn()
    const idToken = userInfo.data!.idToken
    if (!idToken) {
      throw new Error('Failed to get access token')
    }

    return true
  }
  private getEventsAsync = async (): Promise<GoogleCalEvent[]> => {
    if (!this.isSignedIn()) {
      await this.getPermission()
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

    const data = (await response.json()) as { items: Array<GoogleCalEvent>; error?: string }

    if (response.ok) {
      return data.items
    } else {
      throw new Error(data.error)
    }
  }

  public useGetEvents(enabled: boolean, setEnabled: (v: boolean) => void): UseQueryResult<GoogleCalEvent[], Error> {
    return useQuery({
      queryKey: reactQueryKeyStore.calendarEvents(CalendarProviders.GOOGLE),
      queryFn: this.getEventsAsync,
      enabled,
      retry: (_, error) => {
        setEnabled(false)
        return false
      },
    })
  }
}

export const googleCalendarAPI = new GoogleCalendarAPI()
