import { Dimensions, Pressable } from 'react-native'
import { Canvas, Path, Skia } from '@shopify/react-native-skia'
import { ThemeColor } from '@/constants/Colors'

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

  const path = Skia.Path.Make()
    .moveTo(width - 2, 4)
    .lineTo(4, height / 2)
    .lineTo(width - 2, height - 4)

  return (
    <Pressable
      onPress={backFunction}
      style={{ width, height }}
      hitSlop={{ left: width / 2, right: width / 2, top: height / 2, bottom: height / 2 }}
    >
      <Canvas style={{ width, height }}>
        <Path path={path} style="stroke" strokeCap={'round'} strokeJoin={'round'} strokeWidth={5} color={color} />
      </Canvas>
    </Pressable>
  )
}
