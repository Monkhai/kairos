import { Colors } from '@/constants/Colors'
import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia'
import React from 'react'
import { useColorScheme } from 'react-native'

interface Props {
  size: number
}
export default function BigTick({ size }: Props) {
  const theme = useColorScheme() ?? 'light'
  const tickPath = Skia.Path.Make()
    .moveTo(0.32 * size, 0.55 * size)
    .lineTo(0.45 * size, 0.7 * size)
    .lineTo(0.7 * size, 0.35 * size)

  return (
    <Canvas style={{ width: size, height: size, top: 20 }}>
      <Circle cx={size / 2} cy={size / 2} r={size / 2} color={Colors[theme].primaryButton} />
      <Path
        path={tickPath}
        color={Colors[theme].elevated}
        strokeWidth={size / 8}
        style={'stroke'}
        strokeCap={'round'}
        strokeJoin={'round'}
      />
    </Canvas>
  )
}
