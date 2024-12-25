import { Colors } from '@/constants/Colors'
import { taskSearchQueryAtom } from '@/jotaiAtoms/tasksAtoms'
import { useAtom } from 'jotai'
import React from 'react'
import { useColorScheme, View } from 'react-native'
import InputText from './InputText'

export const SEARCH_BAR_HEIGHT = 17 + 16 * 2
export const SEARCH_BAR_HEIGHT_PADDED = SEARCH_BAR_HEIGHT + 32

export default function SearchBar() {
  const theme = useColorScheme() ?? 'light'
  const [filter, setFilter] = useAtom(taskSearchQueryAtom)
  function handleOnChangeText(text: string) {
    if (!text) return
    setFilter(text)
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
      <InputText editable value={filter} onChangeText={handleOnChangeText} placeholder="Search" />
    </View>
  )
}
