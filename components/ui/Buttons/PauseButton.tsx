import { primaryColors } from '@/constants/Colors'
import useElementDimensions from '@/hooks/useElementDimensions'
import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import React from 'react'
import { withTiming } from 'react-native-reanimated'
import { AnimatedPressable, ButtonProps, useAnimatedButtonStyle } from './utils'

interface Props extends ButtonProps {}
export default function PauseButton({ size = 'base', type = 'primary', varient = 'fill', ...props }: Props) {
  const { w, h, onMount } = useElementDimensions()
  const { scale, animatedStyle } = useAnimatedButtonStyle()

  const pausePath = Skia.Path.Make()
  pausePath.moveTo(w * 0.35, h * 0.3)
  pausePath.lineTo(w * 0.35, h * 0.7)
  pausePath.moveTo(w * 0.65, h * 0.3)
  pausePath.lineTo(w * 0.65, h * 0.7)

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
        <Path path={pausePath} color={primaryColors.white} strokeWidth={6} style={'stroke'} strokeCap={'round'} />
      </Canvas>
    </AnimatedPressable>
  )
}
