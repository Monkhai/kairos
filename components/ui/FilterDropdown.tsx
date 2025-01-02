import * as Dropdown from 'zeego/dropdown-menu'
import { View, Text, Button, useColorScheme } from 'react-native'
import React from 'react'
import { useAtom } from 'jotai'
import { showDoneAtom } from '@/jotaiAtoms/tasksAtoms'
import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia'
import { Colors } from '@/constants/Colors'
import TickBoxButton from './Buttons/TickBoxButton'
import { IconSymbol } from './IconSymbol'

export default function FilterDropdown() {
  const theme = useColorScheme() ?? 'light'
  const [showDone, setShowDone] = useAtom(showDoneAtom)

  const size = 24
  const centerX = size / 2
  const centerY = size / 2
  const radius = size * 0.42

  const circlePath = Skia.Path.Make()
  circlePath.addCircle(centerX, centerY, radius)

  const filterPath = Skia.Path.Make()
  const lineWidth = size * 0.6
  const lineSpacing = size * 0.18
  filterPath
    .moveTo(centerX - lineWidth / 2, centerY - lineSpacing)
    .lineTo(centerX + lineWidth / 2, centerY - lineSpacing)
    .moveTo(centerX - (lineWidth / 2) * 0.8, centerY)
    .lineTo(centerX + (lineWidth / 2) * 0.8, centerY)
    .moveTo(centerX - (lineWidth / 2) * 0.6, centerY + lineSpacing)
    .lineTo(centerX + (lineWidth / 2) * 0.6, centerY + lineSpacing)

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
