import PlusButton from '@/components/ui/Buttons/PlusButton/PlusButton'
import { Colors } from '@/constants/Colors'
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs'
import { ParamListBase, TabNavigationState } from '@react-navigation/native'
import { withLayoutContext } from 'expo-router'
import React from 'react'
import { useColorScheme, useWindowDimensions } from 'react-native'

const { Navigator } = createMaterialTopTabNavigator()

export const TopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator)

export default function TabsLayout() {
  const theme = useColorScheme() ?? 'light'
  const { width } = useWindowDimensions()

  return (
    <>
      <TopTabs
        pagerStyle={{ backgroundColor: 'transparent' }}
        style={{ backgroundColor: 'transparent' }}
        screenOptions={{
          tabBarStyle: { backgroundColor: Colors[theme].background, shadowOpacity: 0 },
          tabBarActiveTintColor: Colors[theme].primaryElevated,
          tabBarLabelStyle: { fontWeight: 'bold', fontSize: 17 },
        }}
      >
        <TopTabs.Screen
          name="index"
          options={{
            title: 'Home',
            sceneStyle: { backgroundColor: 'transparent' },
          }}
        />
        <TopTabs.Screen
          name="tasks"
          options={{
            title: 'Tasks',
            sceneStyle: { backgroundColor: 'transparent' },
          }}
        />
      </TopTabs>
      <PlusButton style={{ position: 'absolute', left: width / 2 - 24, bottom: 50, zIndex: 1000 }} />
    </>
  )
}
