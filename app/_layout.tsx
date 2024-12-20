import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Header, useHeaderHeight } from '@react-navigation/elements'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { PortalProvider } from '@gorhom/portal'
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
      <PortalProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: Colors[colorScheme].background },
            headerShadowVisible: false,
            headerTitle: () => <Image source={require('@/assets/images/logo.png')} style={{ width: 50, height: 50 }} />,
          }}
        >
          <Stack.Screen name="(tabs)" options={{}} />
        </Stack>
      </PortalProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}
