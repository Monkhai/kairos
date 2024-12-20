import { Colors } from "@/constants/Colors"
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react"
import { NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, useColorScheme, View } from "react-native"
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  measure,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import DurationPickerSlider from "./DurationPickerSlider"
import { Canvas, Path, Skia } from "@shopify/react-native-skia"

interface Props {
  minutes: number
  hours: number
  setMinutes: Dispatch<SetStateAction<number>>
  setHours: Dispatch<SetStateAction<number>>
}

const ELEMENT_HEIGHT = 40
const GAP = 8
const TOTAL_HEIGHT = ELEMENT_HEIGHT + GAP
const ELEMENTS_IN_VIEW = 3
const LIST_HEIGHT = TOTAL_HEIGHT * ELEMENTS_IN_VIEW

export default function DurationPicker({ hours, minutes, setHours, setMinutes }: Props) {
  const theme = useColorScheme() ?? "light"

  const path = Skia.Path.Make()
    .moveTo(0, TOTAL_HEIGHT)
    .lineTo(0, TOTAL_HEIGHT * 2)

  return (
    <View style={{ height: LIST_HEIGHT, flexDirection: "row", width: 120 }}>
      <View
        style={{
          position: "absolute",
          height: TOTAL_HEIGHT,
          borderRadius: 10,
          width: "100%",
          top: LIST_HEIGHT / 2 - TOTAL_HEIGHT / 2,
          backgroundColor: Colors[theme].background,
        }}
      />
      <DurationPickerSlider type="hours" value={hours} onValueChange={setHours} numberOfItems={99} />
      <Canvas style={{ width: 4, height: LIST_HEIGHT }}>
        <Path path={path} color={Colors[theme].elevated} style={"stroke"} strokeWidth={2} />
      </Canvas>
      <DurationPickerSlider type="minutes" value={minutes} onValueChange={setMinutes} numberOfItems={59} />
    </View>
  )
}
