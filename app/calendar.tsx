import { getGoogleCalendarEvents, isSignedInToGoogle } from '@/calendarsAPI/google'
import reactQueryKeyStore, { CalendarProviders } from '@/queries/reactQueryKeyStore'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Text, View } from 'react-native'

export default function App() {
  const [fetch, setFetch] = useState(isSignedInToGoogle())
  const { data: calendarEvents } = useQuery({
    queryKey: reactQueryKeyStore.calendarEvents(CalendarProviders.GOOGLE),
    queryFn: getGoogleCalendarEvents,
    enabled: fetch,
  })

  GoogleSignin.configure({
    iosClientId: '1091622483065-aqe64cov52jmdqqh1uplmqaelk05tlcr.apps.googleusercontent.com',
    scopes: ['https://www.googleapis.com/auth/calendar.events.readonly'],
  })

  return (
    <View style={{ padding: 20 }}>
      <Button title="Fetch calendar events" onPress={() => setFetch(true)} />
      {calendarEvents
        ? calendarEvents.map((event, index) => (
            <View key={index} style={{ marginVertical: 10 }}>
              <Text>{event.summary}</Text>
              <Text>{new Date(event.start.dateTime).toLocaleString()}</Text>
              <Text>{new Date(event.end.dateTime).toLocaleString()}</Text>
              <Text>{event.colorId}</Text>
            </View>
          ))
        : null}
    </View>
  )
}
