import { PortalProvider } from '@gorhom/portal'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { Provider as JotaiProvider } from 'jotai'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import QueryProvider from '@/providers/QueryProvider'
import { initializeDatabase } from '@/server/setupDB'
import { Image } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()
const err = initializeDatabase()
// clearDB()

// if (err) {
//   console.error(err)
// }

export default function RootLayout() {
  const theme = useColorScheme() ?? 'light'

  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <GestureHandlerRootView style={{ backgroundColor: Colors[theme].background, flex: 1 }}>
      <QueryProvider>
        <JotaiProvider>
          <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
            <PortalProvider>
              <Stack
                initialRouteName="(tabs)"
                screenOptions={{
                  headerStyle: { backgroundColor: Colors[theme].background },
                  headerShadowVisible: false,
                  headerTitle: () => <Image source={require('@/assets/images/logo.png')} style={{ width: 50, height: 50 }} />,
                  contentStyle: { backgroundColor: 'transparent' },
                }}
              >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="shortcut" options={{ animation: 'none', headerShown: false }} />
                <Stack.Screen name="task" options={{ animation: 'none', headerShown: false }} />
              </Stack>
            </PortalProvider>
            <StatusBar style="auto" />
          </ThemeProvider>
        </JotaiProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  )
}
