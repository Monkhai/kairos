import { Colors } from '@/constants/Colors'
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs'
import { ParamListBase, TabNavigationState } from '@react-navigation/native'
import { withLayoutContext } from 'expo-router'
import React, { Fragment } from 'react'
import { useColorScheme } from 'react-native'

const { Navigator } = createMaterialTopTabNavigator()

export const TopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator)

export default function TabsLayout() {
  const theme = useColorScheme() ?? 'light'
  return (
    <Fragment>
      <TopTabs
        screenOptions={{
          tabBarStyle: { backgroundColor: Colors[theme].background, shadowOpacity: 0 },
          tabBarActiveTintColor: Colors[theme].primary,
          tabBarLabelStyle: { fontWeight: 'bold', fontSize: 17 },
        }}
      >
        <TopTabs.Screen name="index" options={{ title: 'Home' }} />
        <TopTabs.Screen name="tasks" options={{ title: 'Tasks' }} />
      </TopTabs>
    </Fragment>
  )
}
