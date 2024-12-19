import { primaryColors } from '@/constants/Colors'
import { ReactNode } from 'react'
import { Pressable, PressableProps, StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export interface ButtonProps extends PressableProps {
  isLoading?: boolean
  suffix?: ReactNode
  prefix?: ReactNode
  label: string
  size?: 'sm' | 'base'
  varient?: 'fill' | 'stroke'
  type?: keyof typeof primaryColors
}

export function getButtonBaseStyle(size: 'sm' | 'base', disabled?: boolean | undefined | null) {
  return StyleSheet.create({
    base: {
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.5 : 1,
      borderRadius: 8,
      height: 48,
      minWidth: size === 'sm' ? 120 : '50%',
    },
  }).base
}
