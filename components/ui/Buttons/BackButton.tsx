import { Dimensions } from 'react-native'
import { Canvas, Path, Skia } from '@shopify/react-native-skia'
import { ThemeColor } from '@/constants/Colors'
import { AnimatedPressable, useAnimatedButtonStyle } from './utils'
import { withTiming } from 'react-native-reanimated'

type Dims = {
  width: number
  height: number
}

interface Props {
  buttonColor: string
  backgroundColor: string
  onBack: () => void
  widthFraction: number
  heightFraction: number
}

export default function BackButton({ buttonColor, backgroundColor, onBack, widthFraction, heightFraction }: Props) {
  const width = Dimensions.get('window').width * widthFraction
  const height = Dimensions.get('window').height * heightFraction
  const { scale, animatedStyle } = useAnimatedButtonStyle()

  const path = Skia.Path.Make()
    .moveTo(width - 2, 4)
    .lineTo(4, height / 2)
    .lineTo(width - 2, height - 4)

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withTiming(0.9)
      }}
      onPressOut={() => {
        scale.value = withTiming(1)
      }}
      onPress={onBack}
      style={[{ width, height, borderRadius: 80 }, animatedStyle]}
      hitSlop={{ left: width / 2, right: width / 2, top: height / 2, bottom: height / 2 }}
    >
      <Canvas style={{ width, height }}>
        <Path path={path} style="stroke" strokeCap={'round'} strokeJoin={'round'} strokeWidth={5} color={backgroundColor} />
      </Canvas>
    </AnimatedPressable>
  )
}
