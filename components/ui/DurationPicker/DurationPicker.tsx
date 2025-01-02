import { Colors } from '@/constants/Colors'
import { Canvas, Path, Skia } from '@shopify/react-native-skia'
import React, { Dispatch, memo, SetStateAction } from 'react'
import { useColorScheme, View } from 'react-native'
import DurationPickerSlider from './DurationPickerSlider'

interface Props {
  minutes: number
  hours: number
  setMinutes: Dispatch<SetStateAction<number>> | ((value: number) => void)
  setHours: Dispatch<SetStateAction<number>> | ((value: number) => void)
  inModal?: boolean
}

const ELEMENT_HEIGHT = 40
const GAP = 8
const TOTAL_HEIGHT = ELEMENT_HEIGHT + GAP
const ELEMENTS_IN_VIEW = 3
const LIST_HEIGHT = TOTAL_HEIGHT * ELEMENTS_IN_VIEW

export default function DurationPicker({ hours, minutes, setHours, setMinutes, inModal }: Props) {
  const theme = useColorScheme() ?? 'light'

  const path = Skia.Path.Make()
    .moveTo(0, TOTAL_HEIGHT)
    .lineTo(0, TOTAL_HEIGHT * 2)

  return (
    <View style={{ height: LIST_HEIGHT, flexDirection: 'row', width: 120 }}>
      <View
        style={{
          position: 'absolute',
          height: TOTAL_HEIGHT,
          borderRadius: 8,
          width: '100%',
          top: LIST_HEIGHT / 2 - TOTAL_HEIGHT / 2,
          backgroundColor: Colors[theme].background,
        }}
      />
      <DurationPickerSlider inModal={inModal} value={hours} onValueChange={setHours} numberOfItems={99} />
      <Canvas style={{ width: 4, height: LIST_HEIGHT }}>
        <Path path={path} color={Colors[theme].elevated} style={'stroke'} strokeWidth={2} />
      </Canvas>
      <DurationPickerSlider inModal={inModal} value={minutes} onValueChange={setMinutes} numberOfItems={59} />
    </View>
  )
}
