/* eslint-disable react/display-name */
import { Colors } from '@/constants/Colors'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { Platform, StyleSheet, TextInputProps, useColorScheme } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

export type InputRef = {
  reset: () => void
}

interface Props extends TextInputProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  type?: 'title' | 'subtitle' | 'base' | 'large' | 'titleHeight' | 'baseHeight'
  editable?: boolean
  lines?: number
}
const InputText = forwardRef<InputRef, Props>(
  ({ onChangeText, value, placeholder, lines = 1, editable = false, type = 'base', style, ...props }: Props, ref) => {
    const theme = useColorScheme() ?? 'light'
    const inputRef = useRef<TextInput>(null)

    useImperativeHandle(ref, () => ({
      reset: () => {
        inputRef.current?.clear()
      },
    }))

    return (
      <TextInput
        ref={inputRef}
        defaultValue={value}
        onEndEditing={e => onChangeText(e.nativeEvent.text)}
        editable={editable}
        focusable={editable}
        pointerEvents={editable ? 'auto' : 'none'}
        placeholder={placeholder}
        placeholderTextColor={Colors[theme].placeholder}
        style={[styles[type], styles.general, { color: Colors[theme].text, overflow: 'hidden' }, style]}
        clearButtonMode="while-editing"
        keyboardType="default"
        multiline={editable}
        {...props}
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
    textAlignVertical: 'top',
    flex: 1,
  },
  titleHeight: {
    fontSize: 21,
    fontWeight: 'bold',
    textAlignVertical: 'top',
    flex: 1,
    height: 60,
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
  baseHeight: {
    fontSize: 14,
    height: 70,
    textAlignVertical: Platform.select({ android: 'top', default: 'auto' }),
  },
})
