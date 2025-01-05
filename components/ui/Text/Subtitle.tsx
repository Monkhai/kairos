import { Colors } from '@/constants/Colors'
import React from 'react'
import { Text, useColorScheme } from 'react-native'
import { textStyles } from './textStyles'

interface Props {
  label: string | number
  small?: boolean
}
export default function Subtitle({ label, small }: Props) {
  const theme = useColorScheme() ?? 'light'
  return <Text style={[textStyles.subTitle, { color: Colors[theme].primaryElevated, fontSize: small ? 12 : undefined }]}>{label}</Text>
}
