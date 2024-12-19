import Screen from '@/components/ui/Screen'
import React from 'react'
import ShortcutCard from './components/ShortcutCard/ShortcutCard'
import { View } from 'react-native'
import { useHeaderHeight } from '@react-navigation/elements'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function HomeView() {
  const headerHeight = useHeaderHeight()
  const { bottom } = useSafeAreaInsets()
  return (
    <Screen>
      <Screen.Body>
        <View style={{ flexDirection: 'column', gap: 24, flex: 1, justifyContent: 'center', paddingBottom: headerHeight + bottom }}>
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
