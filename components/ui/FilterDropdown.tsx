import { Colors } from '@/constants/Colors'
import { showDoneAtom } from '@/jotaiAtoms/tasksAtoms'
import { useAtom } from 'jotai'
import React from 'react'
import { useColorScheme } from 'react-native'
import * as Dropdown from 'zeego/dropdown-menu'
import { IconSymbol } from './IconSymbol'

export default function FilterDropdown() {
  const theme = useColorScheme() ?? 'light'
  const [showDone, setShowDone] = useAtom(showDoneAtom)

  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <IconSymbol name="line.3.horizontal.decrease.circle" color={Colors[theme].primaryButton} />
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item onSelect={() => setShowDone(!showDone)} key="showDoneTasks">
          <Dropdown.ItemTitle>{showDone ? 'Hide Done Tasks' : 'Show Done Tasks'}</Dropdown.ItemTitle>
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  )
}
