import { AnimatedPressable } from '@/components/ui/Buttons/utils'
import DurationPicker from '@/components/ui/DurationPicker/DurationPicker'
import InputText from '@/components/ui/inputs/InputText'
import Subtitle from '@/components/ui/Text/Subtitle'
import { Colors } from '@/constants/Colors'
import { TaskType } from '@/server/tasks/taskTypes'
import { convertDurationToText } from '@/views/Home/components/ShortcutCard/utils'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import { usePathname } from 'expo-router'
import React, { useEffect } from 'react'
import { StyleSheet, useColorScheme, useWindowDimensions, View } from 'react-native'
import { runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import TaskItemActionButtons from './TaskItemActionButtons'
import { LARGE_HEIGHT, PADDING, SMALL_HEIGHT } from './taskItemUtils'

interface Props {
  task: TaskType
  index: number
  contentOffset: number
  onItemPress: (isFocused: boolean) => void
}
export default function TaskItem({ task, index, contentOffset, onItemPress }: Props) {
  const theme = useColorScheme() ?? 'light'
  const { height: screenHeight, width: screenWidth } = useWindowDimensions()
  const pathname = usePathname()
  const [focusedState, setFocusedState] = React.useState(false)

  const scale = useSharedValue(1)
  const focused = useSharedValue(false)
  const zIndex = useSharedValue(0)
  const height = useSharedValue(SMALL_HEIGHT)
  const backdropOpacity = useSharedValue(0)
  const top = useSharedValue((SMALL_HEIGHT + PADDING) * index)

  //TODO refactor this into a hook. Maybe with more of the state on top
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
        height.value = withTiming(LARGE_HEIGHT)
        backdropOpacity.value = withTiming(0.2)
        const center = screenHeight / 2 - LARGE_HEIGHT + contentOffset
        top.value = withTiming(center)
        runOnJS(impactAsync)(ImpactFeedbackStyle.Light)
      } else {
        top.value = withTiming((SMALL_HEIGHT + PADDING) * index)
        height.value = withTiming(SMALL_HEIGHT, {}, () => {
          zIndex.value = 0
        })
        backdropOpacity.value = withTiming(0)
      }
      runOnJS(setFocusedState)(focused)
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
      <AnimatedPressable
        style={[
          {
            width: screenWidth * 2,
            height: screenHeight,
            position: 'absolute',
            top: contentOffset - PADDING,
            left: -100,
            backgroundColor: 'black',
          },
          animatedBackdropStyle,
        ]}
        onPress={() => {
          focused.value = false
          onItemPress(false)
        }}
      />
      <AnimatedPressable
        disabled={focusedState}
        onPress={(e) => {
          focused.value = !focused.value
          onItemPress(!focusedState)
        }}
        onPressIn={() => {
          scale.value = withTiming(1.05)
        }}
        onPressOut={() => (scale.value = withTiming(1))}
        style={[baseStyle, { backgroundColor: Colors[theme].elevated }, animatedStyle]}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <InputText type='title' value={task.title} editable={focusedState} onChangeText={() => alert('Write to db new title')} />
          <Subtitle label={convertDurationToText(task.duration)} />
        </View>

        <InputText
          type='base'
          value={task.description}
          editable={focusedState}
          lines={3}
          onChangeText={() => alert('write to db new description')}
        />

        {/*  */}
        <View style={{ width: '100%', alignItems: 'center' }}>
          {focusedState && (
            <DurationPicker
              hours={Math.floor(task.duration / 60)}
              minutes={task.duration % 60}
              setHours={() => alert('update hours')}
              setMinutes={() => alert('update minutes')}
            />
          )}
        </View>
        {focusedState && <TaskItemActionButtons onDelete={() => alert('implement delete')} />}
      </AnimatedPressable>
    </>
  )
}

const baseStyle = StyleSheet.create({
  base: {
    gap: 8,
    width: '100%',
    position: 'absolute',
    paddingVertical: PADDING,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
}).base
