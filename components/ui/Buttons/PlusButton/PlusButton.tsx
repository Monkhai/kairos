import { Colors } from '@/constants/Colors'
import useElementDimensions from '@/hooks/useElementDimensions'
import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import { router } from 'expo-router'
import React from 'react'
import { useColorScheme } from 'react-native'
import { withTiming } from 'react-native-reanimated'
import { AnimatedPressable, ButtonProps, useAnimatedButtonStyle } from '../utils'

interface Props extends ButtonProps {}
export default function PlusButton({ size = 'base', type = 'primaryButton', varient = 'fill', style, ...props }: Props) {
  const { w, h, onMount } = useElementDimensions()
  const { scale, animatedStyle } = useAnimatedButtonStyle()

  const theme = useColorScheme() ?? 'light'
  const plusPath = Skia.Path.Make()
  plusPath.moveTo(w / 2, h / 3)
  plusPath.lineTo(w / 2, h - h / 3)
  plusPath.moveTo(w / 3, h / 2)
  plusPath.lineTo(w - w / 3, h / 2)

  return (
    <AnimatedPressable
      onLayout={onMount}
      onPressIn={() => {
        impactAsync(ImpactFeedbackStyle.Light)
        scale.value = withTiming(0.95)
      }}
      onPressOut={() => {
        scale.value = withTiming(1)
      }}
      style={[{ width: 60, height: 60 }, animatedStyle, style]}
      onPress={() => {
        router.push('/new-task')
      }}
      {...props}
    >
      <Canvas style={{ position: 'absolute', width: w, height: h }}>
        <Circle r={w / 2} cx={w / 2} cy={w / 2} color={Colors[theme][type]} />
        <Path path={plusPath} color={Colors[theme].white} strokeWidth={6} style={'stroke'} strokeCap={'round'} />
      </Canvas>
    </AnimatedPressable>
  )
}
