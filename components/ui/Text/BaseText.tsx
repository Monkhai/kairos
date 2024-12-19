import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import { textStyles } from './textStyles'
import { Colors, primaryColors } from '@/constants/Colors'

interface Props {
  label: string | number
  varient?: 'primary' | 'secondary' | 'neutral'
}
export default function BaseText({ label, varient }: Props) {
  const theme = useColorScheme() ?? 'light'
  const primaryColor = primaryColors[varient as keyof typeof primaryColors]
  const color = varient !== 'neutral' ? primaryColor : Colors[theme].text
  return (
    <Text
      style={[
        textStyles.base,
        {
          opacity: 0.75,
          color,
        },
      ]}
    >
      {label}
    </Text>
  )
}
