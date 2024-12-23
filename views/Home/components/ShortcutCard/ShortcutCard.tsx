import { View, Text } from 'react-native'
import React from 'react'
import { AnimatedPressable, useAnimatedButtonStyle } from '@/components/ui/Buttons/utils'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import { Colors } from '@/constants/Colors'
import { blue } from 'react-native-reanimated/lib/typescript/Colors'
import Animated, { withTiming } from 'react-native-reanimated'
import { convertDurationToText } from './utils'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { router } from 'expo-router'

interface Props {
  color: 'blue' | 'green' | 'red' | 'orange'
  duration: number
}
export default function ShortcutCard({ color, duration }: Props) {
  const { animatedStyle, scale } = useAnimatedButtonStyle()
  const theme = useColorScheme() ?? 'light'

  const colorMap = {
    blue: Colors[theme].primaryBackground,
    orange: Colors[theme].secondaryBackground,
    green: Colors[theme].successBackground,
    red: Colors[theme].dangerBackground,
  }

  const textColors = {
    blue: Colors[theme].primaryElevated,
    orange: Colors[theme].secondaryElevated,
    green: Colors[theme].successElevated,
    red: Colors[theme].dangerElevated,
  }

  return (
    <AnimatedPressable
      style={[
        animatedStyle,
        { borderRadius: 10, backgroundColor: colorMap[color], width: 150, height: 150, justifyContent: 'center', alignItems: 'center' },
      ]}
      onPress={() => {
        console.log('pressed')
        router.push(`/task/${color}`)
      }}
      onPressIn={() => {
        impactAsync(ImpactFeedbackStyle.Light)
        scale.value = withTiming(0.95)
      }}
      onPressOut={() => {
        scale.value = withTiming(1)
      }}
      sharedTransitionTag='popOut'
    >
      <Text style={{ color: textColors[color], fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
        {convertDurationToText(duration)}
      </Text>
    </AnimatedPressable>
  )
}
