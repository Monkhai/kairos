import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import InputText from './InputText'
import { Colors } from '@/constants/Colors'

interface Props {
  value: string
  onChangeText: (text: string) => void
}
export default function InputField({ onChangeText, value }: Props) {
  const theme = useColorScheme() ?? 'light'
  return (
    <View style={{ backgroundColor: Colors[theme].background, padding: 20, borderRadius: 10 }}>
      <InputText inBottomSheet type="large" placeholder="Task name" value={value} editable onChangeText={onChangeText} />
    </View>
  )
}
