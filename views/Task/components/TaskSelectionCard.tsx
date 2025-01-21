import { Colors } from '@/constants/Colors'
import { topTaskSelectionScreenIndex } from '@/jotaiAtoms/tasksAtoms'
import { TaskType } from '@/server/tasks/taskTypes'
import { convertDurationToText } from '@/views/Home/components/ShortcutCard/utils'
import { useAtom } from 'jotai'
import React, { Dispatch, SetStateAction } from 'react'
import { Dimensions, Platform, useColorScheme } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { TASK_VIEW_HEADER_HEIGHT } from '../../Shortcuts/components/TaskViewHeader'

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
  const height = Dimensions.get('screen').height
  const width = Dimensions.get('screen').width
  const theme = useColorScheme() ?? 'light'
  const [, setJotaiTopIndex] = useAtom(topTaskSelectionScreenIndex)

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
      left: width / 2 - cardWidth / 2 + offsetX * (index - cardsNumber + topIndex.value),
      transform: [{ translateX: translateX.value }, { rotate: `${rotation.value}deg` }],
    }
  })

  const cardStyle = useAnimatedStyle(() => {
    return {
      top: height / 2 - TASK_VIEW_HEADER_HEIGHT - cardHeight / 2 + offsetY * (index - cardsNumber + topIndex.value),
      opacity: opacity.value,
    }
  })

  const shadowStyle = useAnimatedStyle(() => {
    return {
      top: height / 2 - TASK_VIEW_HEADER_HEIGHT - cardHeight / 2 + offsetY * (index - cardsNumber + topIndex.value) - 2.5,
      opacity: opacity.value / 3,
    }
  })

  const shadowBackgroundStyle = useAnimatedStyle(() => {
    return {
      top: height / 2 - TASK_VIEW_HEADER_HEIGHT - cardHeight / 2 + offsetY * (index - cardsNumber + topIndex.value) - 2.5,
      opacity: opacity.value,
    }
  })

  const drag = Gesture.Pan()
    .onUpdate(({ translationX }) => {
      translateX.value = translationX
      rotation.value = (translateX.value / (width / 2)) * 20
    })
    .onEnd(() => {
      if (translateX.value < -0.3 * width) {
        translateX.value = withTiming(-width * 2)
        opacity.value = withTiming(0)
        rotation.value = withTiming(-45)
        runOnJS(Platform.select)({
          android: topIndex.set(withDelay(150, withTiming(topIndex.value + 1))),
          ios: topIndex.set(withTiming(topIndex.value + 1)),
        })
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
              width: cardWidth,
              height: cardHeight,
              position: 'absolute',
              borderRadius: 15,
            },
            sharedStyle,
            shadowBackgroundStyle,
          ]}
        />
        <Animated.View
          style={[
            {
              backgroundColor: textColor,
              width: cardWidth,
              height: cardHeight,
              position: 'absolute',
              borderRadius: 15,
            },
            sharedStyle,
            shadowStyle,
          ]}
        />
        <Animated.View
          style={[
            {
              backgroundColor: Colors[theme].background,
              width: cardWidth,
              height: cardHeight,
              position: 'absolute',
              borderRadius: 15,
            },
            cardStyle,
            sharedStyle,
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
              justifyContent: 'space-between',
              paddingVertical: 16,
              alignItems: 'center',
            },
            cardStyle,
            sharedStyle,
          ]}
        >
          <Animated.Text numberOfLines={2} style={{ color: textColor, fontSize: 40, fontWeight: '500', padding: 5, textAlign: 'center' }}>
            {task.title}
          </Animated.Text>
          <Animated.Text numberOfLines={4} style={{ color: textColor, fontSize: 20, fontWeight: '300', padding: 5, textAlign: 'center' }}>
            {task.description}
          </Animated.Text>
          <Animated.Text style={{ color: textColor, fontSize: 25, fontWeight: '400', padding: 5, textAlign: 'center' }}>
            {convertDurationToText(task.duration)}
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  )
}
