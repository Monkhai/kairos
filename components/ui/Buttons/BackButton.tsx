import { Dimensions } from 'react-native'
import { Canvas, Path, Skia } from '@shopify/react-native-skia'
import { useState } from 'react'
import { AnimatedPressable, useAnimatedButtonStyle } from './utils'
import { withTiming } from 'react-native-reanimated'

type Dims = {
  width: number
  height: number
}

interface Props {
  buttonColor: string
  backgroundColor: string
  backFunction: () => void
  widthFraction: number
  heightFraction: number
}

export default function BackButton({ buttonColor, backgroundColor, backFunction, widthFraction, heightFraction }: Props) {
  const width = Dimensions.get('window').width * widthFraction
  const height = Dimensions.get('window').height * heightFraction
  const { scale, animatedStyle } = useAnimatedButtonStyle()

  const leftPath = Skia.Path.Make()
    .moveTo(width - 1, 0)
    .lineTo(0, height / 2)

  const rightPath = Skia.Path.Make()
    .moveTo(0, height / 2)
    .lineTo(width - 1, height - 1)

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withTiming(0.9)
      }}
      onPressOut={() => {
        scale.value = withTiming(1)
      }}
      onPress={backFunction}
      style={[{ width, height, borderRadius: 100 }, animatedStyle]}
      hitSlop={{ left: width / 2, right: width / 2, top: height / 2, bottom: height / 2 }}
    >
      <Canvas style={{ width, height }}>
        <Path path={leftPath} style='stroke' strokeCap={'round'} strokeWidth={5} color={buttonColor} />
        <Path path={rightPath} style='stroke' strokeCap={'round'} strokeWidth={5} color={buttonColor} />
      </Canvas>
    </AnimatedPressable>
  )
}
