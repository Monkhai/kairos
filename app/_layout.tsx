import FilterDropdown from '@/components/ui/FilterDropdown'
import Logo from '@/components/ui/Logo'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import QueryProvider from '@/providers/QueryProvider'
import { initializeDatabase } from '@/server/setupDB'
import { PortalProvider } from '@gorhom/portal'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import * as Expo from 'expo'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { Provider as JotaiProvider } from 'jotai'
import React, { useEffect } from 'react'
import { I18nManager } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()
const err = initializeDatabase()
if (err) {
  console.error(err)
}

const isRTL = I18nManager.isRTL
if (isRTL) {
  I18nManager.allowRTL(false)
  I18nManager.forceRTL(false)
  Expo.reloadAppAsync()
}

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
                  headerShadowVisible: false,
                  headerStyle: { backgroundColor: Colors[theme].background },
                  headerTitle: () => <Logo size={32} />,
                  contentStyle: { backgroundColor: 'transparent' },
                  headerRight: () => <FilterDropdown />,
                }}
              >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="shortcut" options={{ animation: 'none', headerShown: false }} />
                <Stack.Screen name="task" options={{ animation: 'none', headerShown: false }} />
                <Stack.Screen
                  name="new-task"
                  options={{
                    presentation: 'fullScreenModal',
                    animation: 'slide_from_bottom',
                    headerShown: false,
                    headerStyle: { backgroundColor: Colors[theme].elevated },
                    contentStyle: { backgroundColor: Colors[theme].elevated, flex: 1 },
                  }}
                />
              </Stack>
            </PortalProvider>
            <StatusBar style="auto" />
          </ThemeProvider>
        </JotaiProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  )
}
