import Button from '@/components/ui/Buttons/TextButton'
import Screen from '@/components/ui/Screen'
import { Colors } from '@/constants/Colors'
import { router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { useColorScheme, View } from 'react-native'
import TaskCounter from './components/TaskCounter'

const colorMap = {
  blue: 'primaryBackground',
  orange: 'secondaryBackground',
  green: 'successBackground',
  red: 'dangerBackground',
}

export default function TaskView() {
  const { color } = useLocalSearchParams<{ color: string }>()
  const theme = useColorScheme() ?? 'light'
  const backgroundColor = Colors[theme][colorMap[color as keyof typeof colorMap] as keyof (typeof Colors)[typeof theme]]

  return (
    <Screen noPadding>
      <Screen.Body>
        <View style={{ backgroundColor, flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <TaskCounter />
        </View>
      </Screen.Body>
      <Screen.Footer>
        <View style={{ paddingBottom: 40, backgroundColor, flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Button
            label="Cancel"
            type="dangerButton"
            onPress={() => {
              router.back()
            }}
          />
        </View>
      </Screen.Footer>
    </Screen>
  )
}
