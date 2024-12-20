import { View, Text, TextInput, StyleSheet, useColorScheme } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

interface Props {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  type?: 'title' | 'subtitle' | 'base'
  editable?: boolean
  lines?: number
}
export default function InputText({ onChangeText, value, placeholder, lines = 1, editable = false, type = 'base' }: Props) {
  const theme = useColorScheme() ?? 'light'
  return (
    <TextInput
      ref={ref => {
        if (ref) {
          ref.setNativeProps({ text: value })
        }
      }}
      onBlur={e => {
        onChangeText(e.nativeEvent.text)
      }}
      numberOfLines={lines}
      editable={editable}
      pointerEvents={editable ? 'auto' : 'none'}
      placeholder={placeholder}
      style={[styles[type], styles.general, { color: Colors[theme].text }]}
    />
  )
}

const styles = StyleSheet.create({
  general: { paddingRight: 40, padding: 0 },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    // lineHeight: 21,
    textAlign: 'left',
    textAlignVertical: 'top',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  base: {
    fontSize: 14,
    lineHeight: 14,
  },
})
