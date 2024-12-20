import { Pressable, PressableProps, StyleSheet } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated"

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export interface ButtonProps extends PressableProps {
  size?: "sm" | "base"
  varient?: "fill" | "stroke"
  type?: "primaryButton" | "secondaryButton" | "successButton" | "dangerButton"
}

export function getButtonBaseStyle(size: "sm" | "base", disabled?: boolean | undefined | null) {
  return StyleSheet.create({
    base: {
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      opacity: disabled ? 0.5 : 1,
      borderRadius: 8,
      height: 48,
      minWidth: size === "sm" ? 120 : "50%",
    },
  }).base
}

export function useAnimatedButtonStyle() {
  const scale = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })

  return { scale, animatedStyle }
}
