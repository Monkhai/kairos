import { Colors } from '@/constants/Colors'
import { hideDoneAtom } from '@/jotaiAtoms/tasksAtoms'
import { useAtom } from 'jotai'
import React from 'react'
import { useColorScheme, View } from 'react-native'
import * as Dropdown from 'zeego/dropdown-menu'
import { IconSymbol } from './IconSymbol'
import { usePathname } from 'expo-router'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

export default function FilterDropdown() {
  const theme = useColorScheme() ?? 'light'
  const [hideDone, setHideDone] = useAtom(hideDoneAtom)
  const pathname = usePathname()

  if (pathname !== '/tasks') return null

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <Dropdown.Root>
        <Dropdown.Trigger>
          <IconSymbol name="line.3.horizontal.decrease.circle" color={Colors[theme].primaryButton} />
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onSelect={() => setHideDone(!hideDone)} key="showDoneTasks">
            <Dropdown.ItemTitle>{hideDone ? 'Show Done Tasks' : 'Hide Done Tasks'}</Dropdown.ItemTitle>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </Animated.View>
  )
}
