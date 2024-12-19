import { primaryColors } from '@/constants/Colors'
import useElementDimensions from '@/hooks/useElementDimensions'
import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import React from 'react'
import { withTiming } from 'react-native-reanimated'
import { AnimatedPressable, ButtonProps, useAnimatedButtonStyle } from './utils'

interface Props extends ButtonProps {}
export default function XButton({ size = 'base', type = 'danger', varient = 'fill', ...props }: Props) {
  const { w, h, onMount } = useElementDimensions()
  const { scale, animatedStyle } = useAnimatedButtonStyle()

  const xPath = Skia.Path.Make()
  xPath.moveTo(w / 3, h / 3)
  xPath.lineTo((w / 3) * 2, (h / 3) * 2)
  xPath.moveTo((w / 3) * 2, h / 3)
  xPath.lineTo(w / 3, (h / 3) * 2)

  return (
    <AnimatedPressable
      onLayout={onMount}
      style={[{ width: 60, height: 60 }, animatedStyle]}
      onPressIn={() => {
        impactAsync(ImpactFeedbackStyle.Light)
        scale.value = withTiming(0.95)
      }}
      onPressOut={() => {
        scale.value = withTiming(1)
      }}
      {...props}
    >
      <Canvas style={{ position: 'absolute', width: w, height: h }}>
        <Circle r={w / 2} cx={w / 2} cy={w / 2} color={primaryColors[type]} />
        <Path path={xPath} color={primaryColors.white} strokeWidth={6} style={'stroke'} strokeCap={'round'} />
      </Canvas>
    </AnimatedPressable>
  )
}
