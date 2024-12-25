import { Colors } from '@/constants/Colors'
import { taskFilterAtom } from '@/jotaiAtoms/tasksAtoms'
import { TaskFilter } from '@/server/tasks/queryTypes'
import { useAtom } from 'jotai'
import React from 'react'
import { useColorScheme, View } from 'react-native'
import InputText from './InputText'

export const SEARCH_BAR_HEIGHT = 17 + 16 * 2
export const SEARCH_BAR_HEIGHT_PADDED = SEARCH_BAR_HEIGHT + 32

export default function SearchBar() {
  const theme = useColorScheme() ?? 'light'
  const [, setFilters] = useAtom(taskFilterAtom)
  function handleOnChangeText(text: string) {
    if (!text) return
    const titleText = new TaskFilter('title', '=', text)
    setFilters([titleText])
  }
  return (
    <View
      style={{
        backgroundColor: Colors[theme].inputBackground,
        marginVertical: 16,
        padding: 16,
        height: SEARCH_BAR_HEIGHT,
        width: '100%',
        borderRadius: 10,
        justifyContent: 'center',
      }}
    >
      <InputText editable value={''} onChangeText={handleOnChangeText} placeholder="Search" />
    </View>
  )
}
