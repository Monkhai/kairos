import { Colors } from '@/constants/Colors'
import React from 'react'
import { useColorScheme, View } from 'react-native'
import InputText from './InputText'

interface Props {
  value: string
  onChangeText: (text: string) => void
  inBottomSheet?: boolean
}
export default function InputField({ onChangeText, value, inBottomSheet = true }: Props) {
  const theme = useColorScheme() ?? 'light'
  return (
    <View style={{ backgroundColor: Colors[theme].background, padding: 20, borderRadius: 10 }}>
      <InputText inBottomSheet={inBottomSheet} type="large" placeholder="Task name" value={value} editable onChangeText={onChangeText} />
    </View>
  )
}
