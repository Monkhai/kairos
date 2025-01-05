import { Colors } from '@/constants/Colors'
import { Canvas, Path, Skia } from '@shopify/react-native-skia'
import React, { Dispatch, memo, SetStateAction, useMemo } from 'react'
import { StyleSheet, useColorScheme, View } from 'react-native'
import DurationPickerSlider from './DurationPickerSlider'
import { LIST_HEIGHT, TOTAL_HEIGHT } from './constants'
import Animated, { FadeIn } from 'react-native-reanimated'

interface Props {
  minutes: number
  hours: number
  setMinutes: Dispatch<SetStateAction<number>> | ((value: number) => void)
  setHours: Dispatch<SetStateAction<number>> | ((value: number) => void)
}

export default memo(function DurationPicker({ hours, minutes, setHours, setMinutes }: Props) {
  const theme = useColorScheme() ?? 'light'

  const numberOfHours = useMemo(() => 99, [])
  const numberOfMinutes = useMemo(() => 59, [])

  return (
    <Animated.View entering={FadeIn.delay(300)} style={styles.container}>
      <View style={[styles.background, { backgroundColor: Colors[theme].background }]} />
      <DurationPickerSlider value={hours} onValueChange={setHours} numberOfItems={numberOfHours} />
      <Divider />
      <DurationPickerSlider value={minutes} onValueChange={setMinutes} numberOfItems={numberOfMinutes} />
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  container: {
    height: LIST_HEIGHT,
    flexDirection: 'row',
    width: 120,
  },

  background: {
    position: 'absolute',
    height: TOTAL_HEIGHT,
    borderRadius: 8,
    width: '100%',
    top: LIST_HEIGHT / 2 - TOTAL_HEIGHT / 2,
  },

  divider: {
    width: 4,
    height: LIST_HEIGHT,
  },
})

const Divider = memo(function () {
  const theme = useColorScheme() ?? 'light'
  const path = useMemo(
    () =>
      Skia.Path.Make()
        .moveTo(0, TOTAL_HEIGHT)
        .lineTo(0, TOTAL_HEIGHT * 2),
    []
  )

  return (
    <Canvas style={{ width: 4, height: LIST_HEIGHT }}>
      <Path path={path} color={Colors[theme].elevated} style={'stroke'} strokeWidth={2} />
    </Canvas>
  )
})
