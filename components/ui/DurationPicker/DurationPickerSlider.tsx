import { FlashList } from '@shopify/flash-list'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import Animated, { FadeIn, runOnJS, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import DurationPickerSliderItem from './DurationPickerSliderItem'

const ELEMENT_HEIGHT = 40
const GAP = 8
const TOTAL_HEIGHT = ELEMENT_HEIGHT + GAP
const ELEMENTS_IN_VIEW = 3

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView)
const AnimatedFlashlist = Animated.createAnimatedComponent(FlashList)

interface Props {
  numberOfItems: number
  value: number
  onValueChange: (value: number) => void
  inModal?: boolean
}
export default function DurationPickerSlider({ numberOfItems, value, onValueChange, inModal = false }: Props) {
  const initialContentOffset = value * TOTAL_HEIGHT
  const offset = useSharedValue(value * TOTAL_HEIGHT)

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      offset.value = e.contentOffset.y
    },
    onMomentumEnd: (e) => {
      const el = Math.round(e.contentOffset.y / TOTAL_HEIGHT)
      if (el !== value) {
        runOnJS(onValueChange)(el)
      }
    },
  })

  if (inModal) {
    return (
      <AnimatedScrollView
        contentOffset={{ y: initialContentOffset, x: 0 }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        entering={FadeIn}
        snapToInterval={TOTAL_HEIGHT}
      >
        {Array.from({ length: numberOfItems + 2 }).map((_, i) => (
          <DurationPickerSliderItem key={i} i={i} totalItems={numberOfItems + 2} offset={offset} />
        ))}
      </AnimatedScrollView>
    )
  }

  return (
    <AnimatedFlashlist
      // contentOffset={{ y: initialContentOffset, x: 0 }}
      showsVerticalScrollIndicator={false}
      initialScrollIndex={value}
      onScroll={onScroll}
      entering={FadeIn}
      snapToInterval={TOTAL_HEIGHT}
      data={Array.from({ length: numberOfItems + 2 })}
      renderItem={({ index }) => {
        return <DurationPickerSliderItem key={index} i={index} totalItems={numberOfItems + 2} offset={offset} />
      }}
      estimatedItemSize={TOTAL_HEIGHT}
    />
  )
}
