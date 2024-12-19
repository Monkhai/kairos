import { primaryColors } from '@/constants/Colors'
import useElementDimensions from '@/hooks/useElementDimensions'
import { Canvas, Paragraph, RoundedRect, Skia, TextAlign } from '@shopify/react-native-skia'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import React from 'react'
import { Platform } from 'react-native'
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { AnimatedPressable, ButtonProps, getButtonBaseStyle } from './utils'

interface Props extends ButtonProps {}
export default function Button({
  label,
  prefix,
  suffix,
  isLoading = false,
  size = 'base',
  type = 'primary',
  varient = 'fill',
  ...props
}: Props) {
  const scale = useSharedValue(1)
  const { w, h, onMount } = useElementDimensions()

  const baseStyle = getButtonBaseStyle(size, props.disabled)
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })

  const paragraph = Skia.ParagraphBuilder.Make({ textAlign: TextAlign.Center })
    .pushStyle({
      fontSize: 17,
      fontStyle: { weight: varient === 'stroke' ? 600 : 500 },
      color: varient === 'stroke' ? Skia.Color(primaryColors[type]) : Skia.Color(primaryColors.white),
    })
    .addText(label)
    .pop()
    .build()

  return (
    <AnimatedPressable
      ref={onMount}
      style={[baseStyle, animatedStyle]}
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
        <RoundedRect r={8} height={h} width={w} x={0} y={0} style={varient} strokeWidth={6} color={primaryColors[type]} />
        <Paragraph
          paragraph={paragraph}
          x={0}
          y={Platform.select({
            ios: h / 3,
            default: h / 3.5,
          })}
          width={w}
        />
      </Canvas>
    </AnimatedPressable>
  )
}
