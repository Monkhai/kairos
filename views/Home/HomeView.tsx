import Screen from '@/components/ui/Screen'
import React from 'react'
import ShortcutCard from './components/ShortcutCard/ShortcutCard'
import { View } from 'react-native'

export default function HomeView() {
  return (
    <Screen>
      <Screen.Header></Screen.Header>
      <Screen.Body>
        <View style={{ flexDirection: 'column', gap: 10 }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <ShortcutCard color="blue" />
            <ShortcutCard color="orange" />
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <ShortcutCard color="green" />
            <ShortcutCard color="red" />
          </View>
        </View>
      </Screen.Body>
    </Screen>
  )
}
