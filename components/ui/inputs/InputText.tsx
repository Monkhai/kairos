import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'

interface Props {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  type?: 'title' | 'subtitle' | 'base'
  editable?: boolean
  lines?: number
}
export default function InputText({ onChangeText, value, placeholder, lines = 1, editable = false, type = 'base' }: Props) {
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
      style={[styles[type], styles.general]}
    />
  )
}

const styles = StyleSheet.create({
  general: { paddingRight: 40, borderWidth: 1 },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  base: {
    fontSize: 14,
  },
})
