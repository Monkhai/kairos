import { View, Text, useColorScheme, StyleSheet } from 'react-native'
import React from 'react'
import { TaskType } from '@/server/tasks/taskTypes'
import { AnimatedPressable, useAnimatedButtonStyle } from '@/components/ui/Buttons/utils'
import { Colors, primaryColors } from '@/constants/Colors'
import {
  LinearTransition,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import Title from '@/components/ui/Text/Title'
import Subtitle from '@/components/ui/Text/Subtitle'
import BaseText from '@/components/ui/Text/BaseText'
import { convertDurationToText } from '@/views/Home/components/ShortcutCard/utils'

interface Props {
  task: TaskType
  index: number
}
export default function TaskItem({ task, index }: Props) {
  const theme = useColorScheme() ?? 'light'
  const scale = useSharedValue(1)
  const focused = useSharedValue(false)
  const zIndex = useSharedValue(0)
  const height = useSharedValue(80)
  const top = useSharedValue((80 + 16) * index)

  useAnimatedReaction(
    () => {
      return {
        focused: focused.value,
      }
    },
    ({ focused }) => {
      if (focused) {
        zIndex.value = 1
        height.value = withTiming(300)
        top.value = withTiming(0)
      } else {
        top.value = withTiming((80 + 16) * index)
        height.value = withTiming(80, {}, () => {
          zIndex.value = 0
        })
      }
    }
  )

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      height: height.value,
      zIndex: zIndex.value,
      top: top.value,
    }
  })

  return (
    <AnimatedPressable
      layout={LinearTransition}
      onPress={() => {
        focused.value = !focused.value
      }}
      onPressIn={() => {
        scale.value = withTiming(0.95)
        impactAsync(ImpactFeedbackStyle.Light)
      }}
      onPressOut={() => (scale.value = withTiming(1))}
      style={[baseStyle, { backgroundColor: Colors[theme].elevated }, animatedStyle]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Title label={task.title} />
        <Subtitle varient="primary" label={convertDurationToText(task.duration)} />
      </View>
      <BaseText label={task.description} />
    </AnimatedPressable>
  )
}

const baseStyle = StyleSheet.create({
  base: {
    gap: 8,
    width: '100%',
    position: 'absolute',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
}).base
