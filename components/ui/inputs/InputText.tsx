import { Colors } from '@/constants/Colors'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import React from 'react'
import { StyleSheet, TextInput, useColorScheme } from 'react-native'

interface Props {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  type?: 'title' | 'subtitle' | 'base' | 'large'
  editable?: boolean
  lines?: number
  inBottomSheet?: boolean
}
export default function InputText({
  onChangeText,
  value,
  placeholder,
  lines = 1,
  editable = false,
  inBottomSheet = false,
  type = 'base',
}: Props) {
  const theme = useColorScheme() ?? 'light'

  if (inBottomSheet) {
    return (
      <BottomSheetTextInput
        defaultValue={value}
        onBlur={e => {
          onChangeText(e.nativeEvent.text)
        }}
        numberOfLines={lines}
        editable={editable}
        pointerEvents={editable ? 'auto' : 'none'}
        placeholder={placeholder}
        placeholderTextColor={Colors[theme].placeholder}
        style={[styles[type], styles.general, { color: Colors[theme].text }]}
      />
    )
  }

  return (
    <TextInput
      defaultValue={value}
      onBlur={e => {
        onChangeText(e.nativeEvent.text)
      }}
      numberOfLines={lines}
      editable={editable}
      pointerEvents={editable ? 'auto' : 'none'}
      placeholder={placeholder}
      placeholderTextColor={Colors[theme].placeholder}
      style={[styles[type], styles.general, { color: Colors[theme].text }]}
    />
  )
}

const styles = StyleSheet.create({
  general: { paddingRight: 40, minWidth: 100 },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    textAlign: 'left',
    textAlignVertical: 'top',
  },
  large: {
    fontSize: 17,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  base: {
    fontSize: 14,
  },
})
