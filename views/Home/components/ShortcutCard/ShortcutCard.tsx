import { View, Text } from 'react-native'
import React from 'react'
import { AnimatedPressable, useAnimatedButtonStyle } from '@/components/ui/Buttons/utils'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import { primaryColors } from '@/constants/Colors'
import { blue } from 'react-native-reanimated/lib/typescript/Colors'
import { withTiming } from 'react-native-reanimated'

const colorMap = {
  blue: primaryColors.primaryOpaque,
  orange: primaryColors.secondaryOpaque,
  green: primaryColors.successOpaque,
  red: primaryColors.dangerOpaque,
}

const textColors = {
  blue: primaryColors.primary,
  orange: primaryColors.secondary,
  green: primaryColors.success,
  red: primaryColors.danger,
}

interface Props {
  color: 'blue' | 'green' | 'red' | 'orange'
}
export default function ShortcutCard({ color }: Props) {
  const { animatedStyle, scale } = useAnimatedButtonStyle()
  return (
    <AnimatedPressable
      style={[
        animatedStyle,
        { borderRadius: 10, backgroundColor: colorMap[color], width: 150, height: 150, justifyContent: 'center', alignItems: 'center' },
      ]}
      onPressIn={() => {
        impactAsync(ImpactFeedbackStyle.Light)
        scale.value = withTiming(0.95)
      }}
      onPressOut={() => {
        scale.value = withTiming(1)
      }}
    >
      <Text style={{ color: textColors[color], fontSize: 20, fontWeight: 'bold' }}>{color}</Text>
    </AnimatedPressable>
  )
}
