import { FlashList } from '@shopify/flash-list'
import React from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import DurationPickerSliderItem from './DurationPickerSliderItem'
import { TOTAL_HEIGHT } from './constants'

interface Props {
  data: number[]
  totalItems: number
  value: number
  onValueChange: (value: number) => void
}
export default function DurationPickerSlider({ data, totalItems, value, onValueChange }: Props) {
  const offset = useSharedValue(value * TOTAL_HEIGHT)

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    offset.value = e.nativeEvent.contentOffset.y
  }
  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const el = Math.round(e.nativeEvent.contentOffset.y / TOTAL_HEIGHT)
    if (el !== value) {
      onValueChange(el)
    }
  }

  return (
    <FlashList
      showsVerticalScrollIndicator={false}
      contentOffset={{ y: value * TOTAL_HEIGHT, x: 0 }}
      onScroll={handleScroll}
      onMomentumScrollEnd={handleMomentumEnd}
      snapToInterval={TOTAL_HEIGHT}
      data={data}
      renderItem={({ index }) => <DurationPickerSliderItem i={index} totalItems={totalItems} offset={offset} />}
      keyExtractor={(_, index) => index.toString()}
      estimatedItemSize={TOTAL_HEIGHT}
    />
  )
}
