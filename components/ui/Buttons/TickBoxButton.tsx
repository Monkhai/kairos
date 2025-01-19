import { Colors } from '@/constants/Colors'
import { Canvas, Path, RoundedRect, Skia } from '@shopify/react-native-skia'
import React from 'react'
import { useColorScheme } from 'react-native'

const SIZE = 20

export default function TickBoxButton() {
  const theme = useColorScheme() ?? 'light'
  const tickPath = Skia.Path.Make()
    .moveTo(0.25 * SIZE, 0.55 * SIZE)
    .lineTo(0.4 * SIZE, 0.7 * SIZE)
    .lineTo(0.75 * SIZE, 0.3 * SIZE)

  return (
    <Canvas style={{ width: SIZE, height: SIZE, borderRadius: 8, overflow: 'hidden' }}>
      <RoundedRect height={SIZE} width={SIZE} x={0} y={0} r={4} style={'fill'} color={Colors[theme].primaryButton} />
      <Path path={tickPath} color={Colors.light.elevated} strokeWidth={4} style={'stroke'} strokeCap={'round'} strokeJoin={'round'} />
    </Canvas>
  )
}
