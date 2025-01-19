import Button from '@/components/ui/Buttons/TextButton'
import React from 'react'
import Animated, { FadeIn } from 'react-native-reanimated'

interface Props {
  isDone: boolean
  onDelete: () => void
  onStart: () => void
  onMarkAsNotDone: () => void
}
export default function TaskItemActionButtons({ onDelete, onStart, isDone, onMarkAsNotDone }: Props) {
  return (
    <Animated.View
      entering={FadeIn.delay(300)}
      style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'flex-end', flex: 1 }}
    >
      <Button type="dangerButton" size="sm" label="Delete" onPress={onDelete} />
      {!isDone ? (
        <Button type="primaryButton" size="sm" label="Start" onPress={onStart} />
      ) : (
        <Button type="primaryButton" size="sm" label="Reset" onPress={onMarkAsNotDone} />
      )}
    </Animated.View>
  )
}
