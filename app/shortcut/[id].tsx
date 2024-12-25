import { Colors } from '@/constants/Colors'
import TaskView from '@/views/Task/TaskView'
import React from 'react'
import { useColorScheme } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

export default function id() {
  const theme = useColorScheme() ?? 'light'
  return (
    <Animated.View entering={FadeIn} style={{ flex: 1, backgroundColor: Colors[theme].background }}>
      <TaskView />
    </Animated.View>
  )
}
