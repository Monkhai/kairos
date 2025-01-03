import { Colors } from '@/constants/Colors'
import { hideDoneAtom } from '@/jotaiAtoms/tasksAtoms'
import { useAtom } from 'jotai'
import React from 'react'
import { useColorScheme } from 'react-native'
import * as Dropdown from 'zeego/dropdown-menu'
import { IconSymbol } from './IconSymbol'

export default function FilterDropdown() {
  const theme = useColorScheme() ?? 'light'
  const [hideDone, setHideDone] = useAtom(hideDoneAtom)

  return (
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
  )
}
