import { Colors } from "@/constants/Colors"
import useElementDimensions from "@/hooks/useElementDimensions"
import { Canvas, Paragraph, RoundedRect, Skia, TextAlign } from "@shopify/react-native-skia"
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics"
import React, { ReactNode } from "react"
import { Platform, useColorScheme } from "react-native"
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { AnimatedPressable, ButtonProps, getButtonBaseStyle, useAnimatedButtonStyle } from "./utils"

interface Props extends ButtonProps {
  isLoading?: boolean
  suffix?: ReactNode
  prefix?: ReactNode
  label: string
}
export default function Button({
  label,
  prefix,
  suffix,
  isLoading = false,
  size = "base",
  type = "primaryElevated",
  varient = "fill",
  ...props
}: Props) {
  const { w, h, onMount } = useElementDimensions()
  const { scale, animatedStyle } = useAnimatedButtonStyle()
  const baseStyle = getButtonBaseStyle(size, props.disabled)
  const theme = useColorScheme() ?? "light"

  const paragraph = Skia.ParagraphBuilder.Make({ textAlign: TextAlign.Center })
    .pushStyle({
      fontSize: 17,
      fontStyle: { weight: varient === "stroke" ? 600 : 500 },
      color: varient === "stroke" ? Skia.Color(Colors[theme][type]) : Skia.Color(Colors[theme].buttonText),
    })
    .addText(label)
    .pop()
    .build()

  return (
    <AnimatedPressable
      onLayout={onMount}
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
      <Canvas style={{ position: "absolute", width: w, height: h }}>
        <RoundedRect r={8} height={h} width={w} x={0} y={0} style={varient} strokeWidth={6} color={Colors[theme][type]} />
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
