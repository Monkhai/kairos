import { View, Text, useColorScheme } from "react-native"
import React from "react"
import { textStyles } from "./textStyles"
import { Colors } from "@/constants/Colors"

interface Props {
  label: string | number
  varient?: "primary" | "secondary"
}
export default function Subtitle({ label, varient }: Props) {
  const theme = useColorScheme() ?? "light"
  return <Text style={[textStyles.subTitle, { color: Colors[theme].text }]}>{label}</Text>
}
