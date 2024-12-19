import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Header } from '@react-navigation/elements'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/useColorScheme'
import { Colors } from '@/constants/Colors'
import { Image, useWindowDimensions, View } from 'react-native'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light'

  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors[colorScheme].background },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: 'red' },
          headerTitle: () => <Image source={require('@/assets/images/logo.png')} style={{ width: 50, height: 50 }} />,
        }}
      >
        <Stack.Screen name="(tabs)" options={{}} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}
