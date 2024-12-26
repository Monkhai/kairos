import React, { Dispatch, SetStateAction } from 'react'
import { Dimensions, useColorScheme } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { runOnJS, SharedValue, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Colors } from '@/constants/Colors'
import { TaskType } from '@/server/tasks/taskTypes'
import { convertDurationToText } from '@/views/Home/components/ShortcutCard/utils'
import { TASK_VIEW_HEADER_HEIGHT } from '../../Shortcuts/components/TaskViewHeader'
import { topTaskSelectionScreenIndex } from '@/jotaiAtoms/tasksAtoms'
import { useAtom } from 'jotai'

const cardHeightPercentage = 0.5
const cardWidthPercentage = 0.7
const offsetY = 5
const offsetX = 0

interface Props {
  backgroundColor: string
  textColor: string
  index: number
  topIndex: SharedValue<number>
  cardsNumber: number
  task: TaskType
  setTask: Dispatch<SetStateAction<TaskType | undefined>>
}

export default function TaskSelectionCard({ backgroundColor, textColor, topIndex, index, cardsNumber, task, setTask }: Props) {
  const height = Dimensions.get('window').height
  const width = Dimensions.get('window').width
  const theme = useColorScheme() ?? 'light'
  const [_, setJotaiTopIndex] = useAtom(topTaskSelectionScreenIndex)

  const cardHeight = height * cardHeightPercentage
  const cardWidth = width * cardWidthPercentage

  const translateX = useSharedValue(0)
  const rotation = useSharedValue(0)
  const opacity = useSharedValue(0)

  useAnimatedReaction(
    () => topIndex.value,
    (topIndexValue) => {
      if (index + topIndexValue < cardsNumber && index + topIndexValue >= cardsNumber - 3) {
        opacity.value = withTiming(1)
      }
    }
  )

  const sharedStyle = useAnimatedStyle(() => {
    return {
      top: height / 2 - TASK_VIEW_HEADER_HEIGHT - cardHeight / 2 + offsetY * (index - cardsNumber + topIndex.value),
      left: width / 2 - cardWidth / 2 + offsetX * (index - cardsNumber + topIndex.value),
      transform: [{ translateX: translateX.value }, { rotate: `${rotation.value}deg` }],
      opacity: opacity.value,
    }
  })

  const backgroundStyle = useAnimatedStyle(() => {
    return { shadowOpacity: index - cardsNumber + topIndex.value > 2 ? 0 : 1 }
  })

  const drag = Gesture.Pan()
    .onUpdate(({ translationX }) => {
      translateX.value = translationX
      rotation.value = (translateX.value / (width / 2)) * 20
    })
    .onEnd(() => {
      if (translateX.value < -0.3 * width) {
        topIndex.value = withTiming(topIndex.value + 1)
        translateX.value = withTiming(-width * 2)
        opacity.value = withTiming(0)
        rotation.value = withTiming(-45)
      } else if (translateX.value > 0.3 * width) {
        translateX.value = withTiming(width * 2)
        rotation.value = withTiming(45)
        runOnJS(setJotaiTopIndex)(cardsNumber - index)
        runOnJS(setTask)(task)
      } else {
        translateX.value = withTiming(0)
        rotation.value = withTiming(0)
      }
    })

  return (
    <GestureDetector gesture={drag}>
      <Animated.View>
        <Animated.View
          style={[
            {
              backgroundColor: Colors[theme].background,
              shadowColor: backgroundColor,
              shadowRadius: 0.5,
              width: cardWidth,
              height: cardHeight,
              position: 'absolute',
              borderRadius: 15,
            },
            sharedStyle,
            backgroundStyle,
          ]}
        />
        <Animated.View
          style={[
            {
              backgroundColor: backgroundColor,
              width: cardWidth,
              height: cardHeight,
              position: 'absolute',
              left: width / 2 - (width * cardWidthPercentage) / 2,
              borderRadius: 15,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            },
            sharedStyle,
          ]}
        >
          <Animated.Text style={{ color: textColor, fontSize: 40, fontWeight: '500', padding: 5 }}>{task.title}</Animated.Text>
          <Animated.Text style={{ color: textColor, fontSize: 20, fontWeight: '300', padding: 5 }}>{task.description}</Animated.Text>
          <Animated.Text style={{ color: textColor, fontSize: 25, fontWeight: '400', padding: 5 }}>
            {convertDurationToText(task.duration)}
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  )
}
