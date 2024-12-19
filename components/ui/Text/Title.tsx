import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import { textStyles } from './textStyles'
import { Colors, primaryColors } from '@/constants/Colors'

interface Props {
  label: string | number
  varient?: 'primary' | 'secondary' | 'neutral'
}
export default function Title({ label, varient }: Props) {
  const theme = useColorScheme() ?? 'light'
  return (
    <Text
      style={[
        textStyles.title,
        { color: varient !== 'neutral' ? primaryColors[varient as keyof typeof primaryColors] : Colors[theme].text },
      ]}
    >
      {label}
    </Text>
  )
}
