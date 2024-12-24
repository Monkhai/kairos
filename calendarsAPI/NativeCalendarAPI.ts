import reactQueryKeyStore from '@/queries/reactQueryKeyStore'
import { useQuery } from '@tanstack/react-query'
import {
  Event,
  getCalendarsAsync,
  getEventsAsync,
  PermissionStatus,
  requestCalendarPermissionsAsync,
  requestRemindersPermissionsAsync,
  useCalendarPermissions,
  useRemindersPermissions,
} from 'expo-calendar'
import { useEffect, useState } from 'react'
import { CalendarAPI, CalendarProviders } from './CalenderAPI'

export class NativeCalendarAPI implements CalendarAPI<Event> {
  private async getStatusAsync(): Promise<PermissionStatus> {
    const { status: calStatus } = await requestCalendarPermissionsAsync()
    const { status: remiderStatus } = await requestRemindersPermissionsAsync()

    if (calStatus === PermissionStatus.UNDETERMINED || remiderStatus === PermissionStatus.UNDETERMINED) {
      PermissionStatus.UNDETERMINED
    }
    if (calStatus === PermissionStatus.GRANTED && remiderStatus === PermissionStatus.GRANTED) {
      PermissionStatus.GRANTED
    }

    return PermissionStatus.DENIED
  }

  public async getPermission(): Promise<boolean> {
    const { status: calStatus } = await requestCalendarPermissionsAsync()
    const { status: remiderStatus } = await requestRemindersPermissionsAsync()
    if (calStatus !== 'granted' || remiderStatus !== 'granted') {
      return false
    }
    return true
  }

  useGetEvents(enabled: boolean, setEnabled: (v: boolean) => void) {
    return useQuery({
      queryKey: reactQueryKeyStore.calendarEvents(CalendarProviders.APPLE),
      queryFn: async () => {
        const status = await this.getStatusAsync()

        if (status !== PermissionStatus.GRANTED) {
          const valid = await this.getPermission()
          if (!valid) {
            setEnabled(false)
            throw new Error('Permission denied')
          }
        }

        const calendars = await getCalendarsAsync()
        const now = new Date()
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        const tomrrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
        const ids = calendars.map(calendar => calendar.id)
        return getEventsAsync(ids, yesterday, tomrrow)
      },
      enabled,
      retry: (_, error) => {
        setEnabled(false)
        return false
      },
    })
  }

  public useHasPermission(): PermissionStatus {
    const [status, setStatus] = useState<PermissionStatus>(PermissionStatus.UNDETERMINED)
    const [calStatus] = useCalendarPermissions()
    const [reminderStatus] = useRemindersPermissions()

    useEffect(() => {
      if (!calStatus || !reminderStatus) {
        setStatus(PermissionStatus.UNDETERMINED)
        return
      }

      if (calStatus.status === PermissionStatus.UNDETERMINED || reminderStatus.status === PermissionStatus.UNDETERMINED) {
        setStatus(PermissionStatus.UNDETERMINED)
        return
      }
      if (calStatus.status === PermissionStatus.DENIED || reminderStatus.status === PermissionStatus.DENIED) {
        setStatus(PermissionStatus.DENIED)
        return
      }
      if (calStatus.status === PermissionStatus.GRANTED && reminderStatus.status === PermissionStatus.GRANTED) {
        setStatus(PermissionStatus.GRANTED)
        return
      }
    }, [calStatus, reminderStatus])

    return status
  }
}

export const nativeCalendarAPI = new NativeCalendarAPI()
