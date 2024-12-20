import { PortalProvider } from '@gorhom/portal'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { initializeDatabase } from '@/server/tasks/setupDB'
import { Image } from 'react-native'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()
const err = initializeDatabase()

if (err) {
  console.log(err)
}

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
