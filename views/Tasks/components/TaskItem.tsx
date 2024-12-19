import { AnimatedPressable } from '@/components/ui/Buttons/utils'
import BaseText from '@/components/ui/Text/BaseText'
import Subtitle from '@/components/ui/Text/Subtitle'
import Title from '@/components/ui/Text/Title'
import { Colors } from '@/constants/Colors'
import { TaskType } from '@/server/tasks/taskTypes'
import { convertDurationToText } from '@/views/Home/components/ShortcutCard/utils'
import { Portal } from '@gorhom/portal'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import { usePathname } from 'expo-router'
import React, { useEffect } from 'react'
import { StyleSheet, useColorScheme, useWindowDimensions, View } from 'react-native'
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

interface Props {
  task: TaskType
  index: number
  contentOffset: number
  listHeight: number
  onItemPress: (task: TaskType) => void
}
export default function TaskItem({ task, index, contentOffset, listHeight, onItemPress }: Props) {
  const theme = useColorScheme() ?? 'light'
  const scale = useSharedValue(1)
  const focused = useSharedValue(false)
  const zIndex = useSharedValue(0)
  const height = useSharedValue(80)
  const backdropOpacity = useSharedValue(0)
  const top = useSharedValue((80 + 16) * index)
  const { height: screenHeight, width: screenWidth } = useWindowDimensions()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/') {
      focused.value = false
    }
  }, [pathname])

  useAnimatedReaction(
    () => {
      return {
        focused: focused.value,
      }
    },
    ({ focused }) => {
      if (focused) {
        zIndex.value = 2
        height.value = withTiming(300)
        backdropOpacity.value = withTiming(0.2)
        //calculate the center taking into account the height of the task item, the height of the list and the content offset
        const center = screenHeight / 2 - 300 + contentOffset
        top.value = withTiming(center)
        runOnJS(impactAsync)(ImpactFeedbackStyle.Light)
      } else {
        top.value = withTiming((80 + 16) * index)
        height.value = withTiming(80, {}, () => {
          zIndex.value = 0
        })
        backdropOpacity.value = withTiming(0)
      }
    }
  )

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      zIndex: zIndex.value,
      top: top.value,
      height: height.value,
    }
  })

  const animatedBackdropStyle = useAnimatedStyle(() => {
    return {
      zIndex: zIndex.value - 1,
      opacity: backdropOpacity.value,
    }
  })

  return (
    <>
      <Animated.View
        style={[
          {
            width: screenWidth * 2,
            height: screenHeight,
            position: 'absolute',
            top: contentOffset - 16,
            left: -100,
            backgroundColor: 'black',
          },
          animatedBackdropStyle,
        ]}
      />
      <AnimatedPressable
        onPress={() => {
          focused.value = !focused.value
          onItemPress(task)
        }}
        onPressIn={() => {
          scale.value = withTiming(1.05)
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
    </>
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
