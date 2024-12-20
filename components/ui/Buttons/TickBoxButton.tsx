import { Colors } from "@/constants/Colors"
import useElementDimensions from "@/hooks/useElementDimensions"
import { Canvas, Circle, Path, RoundedRect, Skia } from "@shopify/react-native-skia"
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics"
import React from "react"
import { useSharedValue, withTiming } from "react-native-reanimated"
import { AnimatedPressable, ButtonProps, useAnimatedButtonStyle } from "./utils"
import { useColorScheme } from "react-native"

interface Props extends ButtonProps {}
export default function TickBoxButton({ size = "base", type = "primaryElevated", varient = "fill", ...props }: Props) {
  const { w, h, onMount } = useElementDimensions()
  const { scale, animatedStyle } = useAnimatedButtonStyle()
  const markSize = useSharedValue(0)

  const theme = useColorScheme() ?? "light"
  const tickPath = Skia.Path.Make()
    .moveTo(0.25 * w, 0.55 * h)
    .lineTo(0.4 * w, 0.7 * h)
    .lineTo(0.75 * w, 0.3 * h)

  return (
    <AnimatedPressable
      onPress={() => {
        markSize.value = withTiming(markSize.value === 0 ? 100 : 0)
      }}
      onLayout={onMount}
      style={[{ width: 48, height: 48 }, animatedStyle]}
      onPressIn={() => {
        impactAsync(ImpactFeedbackStyle.Light)
        scale.value = withTiming(0.95)
      }}
      onPressOut={() => {
        scale.value = withTiming(1)
      }}
      {...props}
    >
      <Canvas style={{ position: "absolute", width: w, height: h, borderRadius: 8, overflow: "hidden" }}>
        <RoundedRect height={h} width={w} x={0} y={0} r={8} style={"stroke"} strokeWidth={8} color={Colors[theme][type]} />
        <Circle color={Colors[theme][type]} cx={0} cy={h} r={markSize} style={"fill"} />
        <Path path={tickPath} color={Colors.light.background} strokeWidth={8} style={"stroke"} strokeCap={"round"} strokeJoin={"round"} />
      </Canvas>
    </AnimatedPressable>
  )
}
