import { Colors } from '@/constants/Colors'
import { Canvas, Path, Skia } from '@shopify/react-native-skia'
import React, { Dispatch, memo, SetStateAction, useEffect, useMemo, useState } from 'react'
import { StyleSheet, useColorScheme, View } from 'react-native'
import DurationPickerSlider from './DurationPickerSlider'
import { LIST_HEIGHT, TOTAL_HEIGHT } from './constants'
import Animated, { FadeIn } from 'react-native-reanimated'

interface Props {
  minutes: number
  hours: number
  setMinutes: Dispatch<SetStateAction<number>> | ((value: number) => void)
  setHours: Dispatch<SetStateAction<number>> | ((value: number) => void)
  resetKey?: boolean
}

const HOURS_NUMBER = 99
const MINUTES_NUMBER = 59

export default memo(function DurationPicker({ hours, minutes, setHours, setMinutes, resetKey }: Props) {
  const theme = useColorScheme() ?? 'light'
  const [hoursKey, setHoursKey] = useState(String(Math.random()))
  const [minutesKey, setMinutesKey] = useState(String(Math.random()))

  useEffect(() => {
    setHoursKey(String(Math.random()))
    setMinutesKey(String(Math.random()))
  }, [resetKey])

  return (
    <Animated.View entering={FadeIn.delay(300)} style={styles.container}>
      <View style={[styles.background, { backgroundColor: Colors[theme].background }]} />
      <DurationPickerSlider key={hoursKey} value={hours} onValueChange={setHours} numberOfItems={HOURS_NUMBER} />
      <Divider />
      <DurationPickerSlider key={minutesKey} value={minutes} onValueChange={setMinutes} numberOfItems={MINUTES_NUMBER} />
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
