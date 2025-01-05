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
  const data = React.useMemo(() => Array.from({ length: totalItems }), [totalItems])

  const renderItem = ({ index }: { index: number }) => {
    return <DurationPickerSliderItem i={index} totalItems={totalItems} offset={offset} />
  }

  return (
    <AnimatedFlashlist
      showsVerticalScrollIndicator={false}
      initialScrollIndex={value}
      onScroll={onScroll}
      snapToInterval={TOTAL_HEIGHT}
      data={data}
      renderItem={renderItem}
      estimatedItemSize={TOTAL_HEIGHT}
    />
  )
}
