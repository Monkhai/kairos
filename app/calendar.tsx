import { googleCalendarAPI } from '@/calendarsAPI/GoogleCalendarAPI'
import { nativeCalendarAPI } from '@/calendarsAPI/NativeCalendarAPI'
import Screen from '@/components/ui/Screen'
import Title from '@/components/ui/Text/Title'
import { Colors } from '@/constants/Colors'
import React from 'react'
import { Button, ScrollView, Text, View } from 'react-native'

export default function App() {
  const [fetchGoogle, setFetchGoogle] = React.useState(true)
  const [fetchNative, setFetchNative] = React.useState(true)
  const { data: googleCalendarEvents, error: googleError } = googleCalendarAPI.useGetEvents(fetchGoogle, setFetchGoogle)
  const { data: nativeCalendarEvents, error } = nativeCalendarAPI.useGetEvents(fetchNative, setFetchNative)

  return (
    <Screen noPadding>
      <Screen.Body>
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }} style={{ width: '100%', paddingHorizontal: '10%' }}>
          <Button
            title="Fetch google calendar events"
            onPress={() => {
              setFetchGoogle(true)
            }}
          />
          <Button
            title="Fetch native calendar events"
            onPress={() => {
              setFetchNative(true)
            }}
          />
          <Title label={'Google Calendar Events'} />
          {googleCalendarEvents
            ? googleCalendarEvents.map((event, index) => (
                <View
                  key={index}
                  style={{ marginVertical: 10, backgroundColor: Colors.light.dangerBackground, padding: 8, borderRadius: 10 }}
                >
                  <Text style={{ color: Colors.light.dangerElevated }}>{event.summary}</Text>
                  <Text style={{ color: Colors.light.dangerElevated }}>{new Date(event.start.dateTime).toLocaleString()}</Text>
                  <Text style={{ color: Colors.light.dangerElevated }}>{new Date(event.end.dateTime).toLocaleString()}</Text>
                </View>
              ))
            : null}
          <Title label={'Native Calendar Events'} />
          {nativeCalendarEvents
            ? nativeCalendarEvents
                .filter(e => !e.allDay)
                .map((event, index) => (
                  <View
                    key={index}
                    style={{ marginVertical: 10, backgroundColor: Colors.light.primaryBackground, padding: 8, borderRadius: 10 }}
                  >
                    <Text style={{ color: Colors.light.primaryElevated }}>{event.title}</Text>
                    <Text style={{ color: Colors.light.primaryElevated }}>{new Date(event.startDate).toLocaleString()}</Text>
                    <Text style={{ color: Colors.light.primaryElevated }}>{new Date(event.endDate).toLocaleString()}</Text>
                  </View>
                ))
            : null}
        </ScrollView>
      </Screen.Body>
    </Screen>
  )
}
