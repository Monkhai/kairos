import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import Screen from '@/components/ui/Screen'
import { router, useLocalSearchParams } from 'expo-router'
import { Colors } from '@/constants/Colors'
import Animated from 'react-native-reanimated'
import { AnimatedPressable } from '@/components/ui/Buttons/utils'

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
        <View style={{ backgroundColor, flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}></View>
      </Screen.Body>
    </Screen>
  )
}
