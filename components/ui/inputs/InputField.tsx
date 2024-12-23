import { Colors } from '@/constants/Colors'
import React from 'react'
import { useColorScheme, View } from 'react-native'
import InputText from './InputText'
import Subtitle from '../Text/Subtitle'

interface Props {
  value: string
  onChangeText: (text: string) => void
  inBottomSheet?: boolean
  label?: string
  placeholder?: string
}
export default function InputField({ onChangeText, value, label, placeholder, inBottomSheet = true }: Props) {
  const theme = useColorScheme() ?? 'light'
  return (
    <View style={{ width: '100%', gap: 8 }}>
      <View style={{ marginLeft: 8 }}>{label ? <Subtitle label={label} /> : null}</View>
      <View
        style={{
          backgroundColor: Colors[theme].background,
          padding: 20,
          borderRadius: 10,
          width: '100%',
        }}
      >
        <InputText
          inBottomSheet={inBottomSheet}
          type="large"
          placeholder={placeholder}
          value={value}
          editable
          onChangeText={onChangeText}
        />
      </View>
    </View>
  )
}
