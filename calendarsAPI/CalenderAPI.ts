import { UseQueryResult } from '@tanstack/react-query'

export enum CalendarProviders {
  GOOGLE = 'google',
  APPLE = 'apple',
}

export interface CalendarAPI<T> {
  useGetEvents: (enabled: boolean, setEnabled: (v: boolean) => void) => UseQueryResult<T[], Error>
}
