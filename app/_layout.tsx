import { PortalProvider } from '@gorhom/portal'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { initializeDatabase } from '@/server/setupDB'
import { Image, View } from 'react-native'
import QueryProvider from '@/providers/QueryProvider'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import BackButton from '@/components/ui/Buttons/BackButton'
import { TaskViewHeader } from '@/views/Task/components/TaskViewHeader'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()
const err = initializeDatabase()

if (err) {
  console.error(err)
}

export default function RootLayout() {
  const theme = useColorScheme() ?? 'light'

  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <GestureHandlerRootView style={{ backgroundColor: Colors[theme].background, flex: 1 }}>
      <QueryProvider>
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
              <Stack.Screen
                name="shortcut"
                options={{
                  animation: 'none',
                  animationDuration: 1000,
                  header: () => {
                    return <TaskViewHeader />
                  },
                }}
              />
            </Stack>
          </PortalProvider>
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  )
}
