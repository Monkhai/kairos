import { Colors } from '@/constants/Colors'
import { Canvas, Path, Skia } from '@shopify/react-native-skia'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import React from 'react'
import { useColorScheme } from 'react-native'
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { AnimatedPressable } from './utils'

const circleLinesNumber = 18
const inRadius = 8
const outRadius = 14

interface Props {
  onPress: () => void
  size: number
}
export default function TimerButton({ size, onPress }: Props) {
  const scale = useSharedValue(1)
  const theme = useColorScheme() ?? 'light'

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })

  const paths = Array.from({ length: circleLinesNumber }).map((_, i) => {
    const radians = (i * 2 * Math.PI) / circleLinesNumber - Math.PI / 2
    let startX = inRadius * Math.cos(radians) + size / 2
    let endX = outRadius * Math.cos(radians) + size / 2
    let startY = inRadius * Math.sin(radians) + size / 2
    let endY = outRadius * Math.sin(radians) + size / 2
    const path = Skia.Path.Make().moveTo(startX, startY).lineTo(endX, endY)
    return path
  })

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        impactAsync(ImpactFeedbackStyle.Light)
        scale.value = withTiming(0.95)
      }}
      onPressOut={() => {
        scale.value = withTiming(1)
      }}
      style={animatedStyle}
    >
      <Canvas style={{ width: size, height: size, backgroundColor: Colors[theme].tertiaryBackground, borderRadius: 8 }}>
        {paths.map((path, i) => (
          <Path key={i} path={path} color={Colors[theme].tertiaryButton} style={'stroke'} strokeWidth={2} strokeCap={'round'} />
        ))}
      </Canvas>
    </AnimatedPressable>
  )
}
