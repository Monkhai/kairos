import Screen from '@/components/ui/Screen'
import { useHeaderHeight } from '@react-navigation/elements'
import React from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ShortcutCard from './components/ShortcutCard/ShortcutCard'
import { clearDB, initializeDatabase } from '@/server/setupDB'
import { usePathname } from 'expo-router'

export default function HomeView() {
  const headerHeight = useHeaderHeight()
  const { bottom } = useSafeAreaInsets()
  const pathname = usePathname()

  return (
    <Screen noPadding>
      <Screen.Body>
        <View style={[styles.container, { paddingBottom: Platform.select({ ios: headerHeight + bottom, android: bottom }) }]}>
          <View style={styles.cardsRow}>
            <ShortcutCard id={1} />
            <ShortcutCard id={2} />
          </View>
          <View style={styles.cardsRow}>
            <ShortcutCard id={3} />
            <ShortcutCard id={4} />
          </View>
        </View>
      </Screen.Body>
      {Platform.OS === 'android' ? <Screen.Footer></Screen.Footer> : null}
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    gap: 24,
    flex: 1,
    justifyContent: 'center',
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 24,
  },
})
