import { FlashList } from '@shopify/flash-list'
import React from 'react'
import Animated, { runOnJS, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import DurationPickerSliderItem from './DurationPickerSliderItem'
import { TOTAL_HEIGHT } from './constants'

const AnimatedFlashlist = Animated.createAnimatedComponent(FlashList)

interface Props {
  numberOfItems: number
  value: number
  onValueChange: (value: number) => void
}
export default function DurationPickerSlider({ numberOfItems, value, onValueChange }: Props) {
  const offset = useSharedValue(value * TOTAL_HEIGHT)

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

  const totalItems = React.useMemo(() => numberOfItems + 3, [numberOfItems])
  const data = React.useMemo(() => timesMap[numberOfItems as keyof typeof timesMap], [numberOfItems])

  return (
    <AnimatedFlashlist
      showsVerticalScrollIndicator={false}
      initialScrollIndex={value}
      onScroll={onScroll}
      snapToInterval={TOTAL_HEIGHT}
      data={data}
      renderItem={({ index }) => <DurationPickerSliderItem i={index} totalItems={totalItems} offset={offset} />}
      estimatedItemSize={TOTAL_HEIGHT}
      scrollEventThrottle={16}
    />
  )
}

const timesMap = {
  59: [...Array(62).keys()],
  99: [...Array(102).keys()],
}
