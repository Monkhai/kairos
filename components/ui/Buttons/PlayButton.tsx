import { primaryColors } from '@/constants/Colors'
import useElementDimensions from '@/hooks/useElementDimensions'
import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import React from 'react'
import { withTiming } from 'react-native-reanimated'
import { AnimatedPressable, ButtonProps, useAnimatedButtonStyle } from './utils'

interface Props extends ButtonProps {}
export default function PlayButton({ size = 'base', type = 'primary', varient = 'fill', ...props }: Props) {
  const { w, h, onMount } = useElementDimensions()
  const { scale, animatedStyle } = useAnimatedButtonStyle()

  const PlayPath = Skia.Path.Make()
  const roundness = 3

  PlayPath.moveTo(w * 0.3 + roundness, h * 0.3)
  PlayPath.lineTo(w * 0.3 + roundness, h * 0.7 - roundness)
  PlayPath.quadTo(w * 0.3 + roundness, h * 0.7, w * 0.3 + roundness * 2, h * 0.7)
  PlayPath.lineTo(w * 0.75 - roundness, h * 0.5 + roundness)
  PlayPath.quadTo(w * 0.75, h * 0.5, w * 0.75 - roundness, h * 0.5 - roundness)
  PlayPath.lineTo(w * 0.3 + roundness * 2, h * 0.3)
  PlayPath.quadTo(w * 0.3 + roundness, h * 0.3, w * 0.3 + roundness, h * 0.3 + roundness)
  PlayPath.close()

  return (
    <AnimatedPressable
      ref={onMount}
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

        <Path path={PlayPath} color={primaryColors.white} strokeWidth={6} style={'fill'} />
      </Canvas>
    </AnimatedPressable>
  )
}
