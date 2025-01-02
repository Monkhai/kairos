import { Colors } from '@/constants/Colors'
import { taskSearchQueryAtom } from '@/jotaiAtoms/tasksAtoms'
import { useAtom } from 'jotai'
import React, { useRef } from 'react'
import { useColorScheme, View } from 'react-native'
import InputText, { InputRef } from './InputText'

export const SEARCH_BAR_HEIGHT = 17 + 16 * 2
export const SEARCH_BAR_HEIGHT_PADDED = SEARCH_BAR_HEIGHT + 32

export default function SearchBar() {
  const theme = useColorScheme() ?? 'light'
  const [filter, setFilter] = useAtom(taskSearchQueryAtom)
  const inputRef = useRef<InputRef>(null)
  function handleOnChangeText(text: string) {
    if (filter !== text) {
      setFilter(text ?? '')
    }
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors[theme].inputBackground,
        marginVertical: 16,
        padding: 16,
        height: SEARCH_BAR_HEIGHT,
        width: '100%',
        borderRadius: 8,
        justifyContent: 'center',
      }}
    >
      <InputText ref={inputRef} editable={true} value={filter} onChangeText={handleOnChangeText} placeholder="Search" />
    </View>
  )
}
