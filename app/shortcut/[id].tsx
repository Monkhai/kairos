import { Colors } from '@/constants/Colors'
import ShortcutView from '@/views/Shortcuts/ShortcutsView'
import TaskView from '@/views/Task/TaskView'
import React from 'react'
import { useColorScheme } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'

export default function id() {
  const theme = useColorScheme() ?? 'light'
  return (
    <Animated.View entering={FadeIn} style={{ flex: 1, backgroundColor: Colors[theme].background }}>
      <ShortcutView />
    </Animated.View>
  )
}
