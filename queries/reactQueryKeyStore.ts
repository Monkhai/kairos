export enum CalendarProviders {
  GOOGLE = 'google',
  APPLE = 'apple',
}

export default {
  tasks: () => ['tasks'],
  deafult: (id: string) => ['default', id],
  calendarEvents: (provider: CalendarProviders) => ['calendarEvents', provider],
}
