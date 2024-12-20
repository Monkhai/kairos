import { View, Text, useColorScheme } from "react-native"
import React from "react"
import { textStyles } from "./textStyles"
import { Colors } from "@/constants/Colors"

interface Props {
  label: string | number
  varient?: "primary" | "secondary"
}
export default function BaseText({ label, varient }: Props) {
  const theme = useColorScheme() ?? "light"
  const color = Colors[theme].text
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
