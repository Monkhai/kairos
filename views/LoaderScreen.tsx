import Screen from '@/components/ui/Screen'
import { Colors } from '@/constants/Colors'
import React from 'react'
import { ActivityIndicator, useColorScheme, View } from 'react-native'

export default function LoaderScreen() {
  const theme = useColorScheme() ?? 'light'
  return (
    <Screen>
      <Screen.Body>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size={'large'} color={Colors[theme].primaryButton} />
        </View>
      </Screen.Body>
      <Screen.Footer />
    </Screen>
  )
}
