import { CalendarProviders } from '@/calendarsAPI/CalenderAPI'

export default {
  tasks: () => ['tasks'],
  deafult: (id: string) => ['default', id],
  calendarEvents: (provider: CalendarProviders) => ['calendarEvents', provider],
}
