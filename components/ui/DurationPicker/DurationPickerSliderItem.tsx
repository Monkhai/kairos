import { Colors } from '@/constants/Colors'
import { memo, useMemo } from 'react'
import { StyleSheet, Text, useColorScheme } from 'react-native'
import Animated, { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { ELEMENT_HEIGHT, GAP, TOTAL_HEIGHT, LIST_HEIGHT } from './constants'

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

export default memo(function DurationPickerSliderItem({ i, offset, totalItems }: Props) {
  const animatedStyle = useAnimatedStyle(() => {
    const middleElementOffset = offset.value + LIST_HEIGHT / 2 - ELEMENT_HEIGHT / 2
    const thisElementsOffset = i * TOTAL_HEIGHT
    const delta = Math.abs(middleElementOffset - thisElementsOffset)
    const scale = interpolate(delta, [0, TOTAL_HEIGHT], [1, 0.8])
    const opacity = interpolate(delta, [0, TOTAL_HEIGHT], [1, 0.4])

    return {
      transform: [{ scale }],
      opacity,
    }
  })

  const theme = useColorScheme() ?? 'light'
  const styles = useMemo(() => makeStyles(theme), [theme])

  if (i === 0 || i > totalItems - 2) {
    return <Animated.View style={[animatedStyle, styles.item]} />
  }
  return (
    <Animated.View style={[animatedStyle, styles.item]}>
      <Text style={styles.itemText}>{getLabel(i - 1)}</Text>
    </Animated.View>
  )
})

function getLabel(time: number) {
  //should return in xx format
  if (time < 10) {
    return `0${time}`
  }
  return `${time}`
}
