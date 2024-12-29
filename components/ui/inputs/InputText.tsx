import { Colors } from '@/constants/Colors'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { StyleSheet, TextInput, useColorScheme } from 'react-native'

export type InputRef = {
  reset: () => void
}

interface Props {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  type?: 'title' | 'subtitle' | 'base' | 'large'
  editable?: boolean
  lines?: number
  inBottomSheet?: boolean
}
const InputText = forwardRef<InputRef, Props>(
  ({ onChangeText, value, placeholder, lines = 1, editable = false, inBottomSheet = false, type = 'base' }: Props, ref) => {
    const theme = useColorScheme() ?? 'light'
    const inputRef = useRef<TextInput>(null)

    useImperativeHandle(ref, () => ({
      reset: () => {
        inputRef.current?.clear()
      },
    }))

    if (inBottomSheet) {
      return (
        <BottomSheetTextInput
          ref={inputRef as any}
          defaultValue={value}
          onBlur={e => {
            onChangeText(e.nativeEvent.text)
          }}
          numberOfLines={lines}
          editable={editable}
          pointerEvents={editable ? 'auto' : 'none'}
          placeholder={placeholder}
          placeholderTextColor={Colors[theme].placeholder}
          style={[styles[type], styles.general, { color: Colors[theme].text, width: '100%' }]}
        />
      )
    }

    return (
      <TextInput
        ref={inputRef}
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
        clearButtonMode="while-editing"
      />
    )
  }
)

export default InputText

const styles = StyleSheet.create({
  general: { minWidth: 100 },
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
