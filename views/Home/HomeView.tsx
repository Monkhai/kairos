import Screen from '@/components/ui/Screen'
import React from 'react'
import ShortcutCard from './components/ShortcutCard/ShortcutCard'
import { View } from 'react-native'

export default function HomeView() {
  return (
    <Screen>
      <Screen.Header></Screen.Header>
      <Screen.Body>
        <View style={{ flexDirection: 'column', gap: 24 }}>
          <View style={{ flexDirection: 'row', gap: 24 }}>
            <ShortcutCard duration={70} color="blue" />
            <ShortcutCard duration={70} color="orange" />
          </View>
          <View style={{ flexDirection: 'row', gap: 24 }}>
            <ShortcutCard duration={70} color="green" />
            <ShortcutCard duration={70} color="red" />
          </View>
        </View>
      </Screen.Body>
    </Screen>
  )
}
