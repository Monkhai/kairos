import { Colors } from '@/constants/Colors'
import useElementDimensions from '@/hooks/useElementDimensions'
import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import React, { useRef } from 'react'
import { withTiming } from 'react-native-reanimated'
import { AnimatedPressable, ButtonProps, useAnimatedButtonStyle } from '../utils'
import { Text, useColorScheme } from 'react-native'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import CustomBottomSheet from '../../BottomSheet'
import NewTaskSheet from './components/NewTaskSheet'

interface Props extends ButtonProps {}
export default function PlusButton({ size = 'base', type = 'primaryButton', varient = 'fill', style, ...props }: Props) {
  const { w, h, onMount } = useElementDimensions()
  const { scale, animatedStyle } = useAnimatedButtonStyle()
  const bottomSheetRef = useRef<BottomSheet>(null)

  const theme = useColorScheme() ?? 'light'
  const plusPath = Skia.Path.Make()
  plusPath.moveTo(w / 2, h / 3)
  plusPath.lineTo(w / 2, h - h / 3)
  plusPath.moveTo(w / 3, h / 2)
  plusPath.lineTo(w - w / 3, h / 2)

  return (
    <>
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
          bottomSheetRef.current?.expand()
        }}
        {...props}
      >
        <Canvas style={{ position: 'absolute', width: w, height: h }}>
          <Circle r={w / 2} cx={w / 2} cy={w / 2} color={Colors[theme][type]} />
          <Path path={plusPath} color={Colors[theme].white} strokeWidth={6} style={'stroke'} strokeCap={'round'} />
        </Canvas>
      </AnimatedPressable>

      <NewTaskSheet bottomSheetRef={bottomSheetRef} />
    </>
  )
}
