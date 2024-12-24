import { Dimensions, Pressable } from 'react-native'
import { Canvas, Path, Skia } from '@shopify/react-native-skia'

type Dims = {
  width: number
  height: number
}

interface Props {
  color: string
  backFunction: () => void
  widthFraction: number
  heightFraction: number
}

export default function BackButton({ color, backFunction, widthFraction, heightFraction }: Props) {
  const width = Dimensions.get('window').width * widthFraction
  const height = Dimensions.get('window').height * heightFraction

  const leftPath = Skia.Path.Make()
    .moveTo(width - 1, 0)
    .lineTo(0, height / 2)

  const rightPath = Skia.Path.Make()
    .moveTo(0, height / 2)
    .lineTo(width - 1, height - 1)

  return (
    <Pressable
      onPress={backFunction}
      style={{ width, height }}
      hitSlop={{ left: width / 2, right: width / 2, top: height / 2, bottom: height / 2 }}
    >
      <Canvas style={{ width, height }}>
        <Path path={leftPath} style='stroke' strokeCap={'round'} strokeWidth={5} color={color} />
        <Path path={rightPath} style='stroke' strokeCap={'round'} strokeWidth={5} color={color} />
      </Canvas>
    </Pressable>
  )
}
