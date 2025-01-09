import { Colors } from '@/constants/Colors'
import { useMemo } from 'react'
import { Platform, StyleSheet, Text, useColorScheme } from 'react-native'
import Animated, { interpolate, SharedValue, useAnimatedStyle, useDerivedValue } from 'react-native-reanimated'
import { ELEMENT_HEIGHT, GAP, LIST_HEIGHT, TOTAL_HEIGHT } from './constants'

interface Props {
  i: number
  offset: SharedValue<number>
  totalItems: number
}

const makeStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    item: {
      width: '100%',
      height: ELEMENT_HEIGHT,
      marginVertical: GAP / 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: Colors[theme].text,
    },
  })

export default function DurationPickerSliderItem({ i, offset, totalItems }: Props) {
  if (Platform.OS === 'ios') {
    return <DurationPickerSliderItemIOS i={i} offset={offset} totalItems={totalItems} />
  }
  return <DurationPickerSliderItemAndroid i={i} offset={offset} totalItems={totalItems} />
}

function DurationPickerSliderItemIOS({ i, offset, totalItems }: Props) {
  const theme = useColorScheme() ?? 'light'
  const styles = useMemo(() => makeStyles(theme), [theme])
  const values = useDerivedValue(() => {
    const middleElementOffset = offset.value + LIST_HEIGHT / 2 - ELEMENT_HEIGHT / 2
    const thisElementsOffset = i * TOTAL_HEIGHT
    const delta = Math.abs(middleElementOffset - thisElementsOffset)
    const opacity = interpolate(delta, [TOTAL_HEIGHT, 0], [0.4, 1])
    const scale = interpolate(delta, [TOTAL_HEIGHT, 0], [0.8, 1])
    return { opacity, scale }
  })
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: values.value.scale }],
      opacity: values.value.opacity,
    }
  })
  if (i === 0 || i > totalItems - 2) {
    return <Animated.View style={[styles.item]} />
  }
  return (
    <Animated.View style={[animatedStyle, styles.item]}>
      <Text style={styles.itemText}>{getLabel(i - 1)}</Text>
    </Animated.View>
  )
}
function DurationPickerSliderItemAndroid({ i, offset, totalItems }: Props) {
  const theme = useColorScheme() ?? 'light'
  const styles = useMemo(() => makeStyles(theme), [theme])
  if (i === 0 || i > totalItems - 2) {
    return <Animated.View style={[styles.item]} />
  }
  return (
    <Animated.View style={[styles.item]}>
      <Text style={styles.itemText}>{getLabel(i - 1)}</Text>
    </Animated.View>
  )
}

function getLabel(time: number) {
  //should return in xx format
  if (time < 10) {
    return `0${time}`
  }
  return `${time}`
}
