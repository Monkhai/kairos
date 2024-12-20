import React, { useEffect, useLayoutEffect } from 'react'
import Animated, { FadeOut, runOnJS, useAnimatedRef, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import DurationPickerSliderItem from './DurationPickerSliderItem'

const ELEMENT_HEIGHT = 40
const GAP = 8
const TOTAL_HEIGHT = ELEMENT_HEIGHT + GAP
const ELEMENTS_IN_VIEW = 3
const LIST_HEIGHT = TOTAL_HEIGHT * ELEMENTS_IN_VIEW

interface Props {
  numberOfItems: number
  value: number
  onValueChange: (value: number) => void
  type: 'hours' | 'minutes'
}
export default function DurationPickerSlider({ numberOfItems, value, onValueChange, type }: Props) {
  const offset = useSharedValue(0)
  const ref = useAnimatedRef<Animated.ScrollView>()
  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      offset.value = e.contentOffset.y
    },
    onMomentumEnd: e => {
      const el = Math.round(e.contentOffset.y / TOTAL_HEIGHT)
      if (el !== value) {
        runOnJS(onValueChange)(el)
      }
    },
  })

  useEffect(() => {
    ref.current?.scrollTo({ y: value * TOTAL_HEIGHT, animated: false })
  }, [])

  return (
    <Animated.ScrollView
      ref={ref}
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      exiting={FadeOut.duration(20)}
      snapToInterval={TOTAL_HEIGHT}
    >
      {Array.from({ length: numberOfItems + 2 }).map((_, i) => (
        <DurationPickerSliderItem key={i} i={i} totalItems={numberOfItems + 2} offset={offset} />
      ))}
    </Animated.ScrollView>
  )
}
