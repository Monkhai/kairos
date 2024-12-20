import { Colors } from "@/constants/Colors"
import { StyleSheet, Text, useColorScheme } from "react-native"
import Animated, { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated"

const ELEMENT_HEIGHT = 40
const GAP = 8
const TOTAL_HEIGHT = ELEMENT_HEIGHT + GAP
const ELEMENTS_IN_VIEW = 3
const LIST_HEIGHT = TOTAL_HEIGHT * ELEMENTS_IN_VIEW

interface Props {
  i: number
  offset: SharedValue<number>
  totalItems: number
}

export default function DuartionPickerSliderItem({ i, offset, totalItems }: Props) {
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

  const theme = useColorScheme() ?? "light"
  const styles = StyleSheet.create({
    item: {
      width: "100%",
      height: ELEMENT_HEIGHT,
      marginVertical: GAP / 2,
      justifyContent: "center",
      alignItems: "center",
    },
    itemText: {
      fontSize: 22,
      fontWeight: "bold",
      color: Colors[theme].text,
    },
  })

  if (i === 0 || i > totalItems - 2) {
    return <Animated.View style={[animatedStyle, styles.item]}></Animated.View>
  }

  return (
    <Animated.View style={[animatedStyle, styles.item]}>
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
