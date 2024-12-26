import { AnimatedPressable } from '@/components/ui/Buttons/utils'
import DurationPicker from '@/components/ui/DurationPicker/DurationPicker'
import InputText from '@/components/ui/inputs/InputText'
import Subtitle from '@/components/ui/Text/Subtitle'
import { Colors } from '@/constants/Colors'
import { TaskType } from '@/server/tasks/taskTypes'
import { convertDurationToText } from '@/views/Home/components/ShortcutCard/utils'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import { router, usePathname } from 'expo-router'
import React, { useEffect } from 'react'
import { StyleSheet, useColorScheme, useWindowDimensions, View } from 'react-native'
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import TaskItemActionButtons from './TaskItemActionButtons'
import { LARGE_HEIGHT, PADDING, SMALL_HEIGHT } from './taskItemUtils'
import { WINDOW_HEIGHT } from '@gorhom/bottom-sheet'
import { useMutation } from '@tanstack/react-query'
import { updateTask } from '@/server/tasks/queries'
import { queryClient } from '@/providers/QueryProvider'
import reactQueryKeyStore from '@/queries/reactQueryKeyStore'
import { Portal } from '@gorhom/portal'
import { SEARCH_BAR_HEIGHT, SEARCH_BAR_HEIGHT_PADDED } from '@/components/ui/inputs/SearchBar'
import { useAtom } from 'jotai'
import { taskSearchQueryAtom } from '@/jotaiAtoms/tasksAtoms'

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
  const [searchQuery] = useAtom(taskSearchQueryAtom)
  const [focusedState, setFocusedState] = React.useState(false)

  const scale = useSharedValue(1)
  const focused = useSharedValue(false)
  const zIndex = useSharedValue(0)
  const height = useSharedValue(SMALL_HEIGHT)
  const backdropOpacity = useSharedValue(0)
  const top = useSharedValue((SMALL_HEIGHT + PADDING) * index + SEARCH_BAR_HEIGHT_PADDED)

  const { mutate } = useMutation({
    mutationFn: async ({
      id,
      newDescription,
      newDuration,
      newTitle,
    }: {
      id: string
      newTitle: string
      newDescription: string
      newDuration: number
    }) => await updateTask(id, newTitle, newDescription, newDuration),
    onMutate: ({ id, newDescription, newDuration, newTitle }) => {
      const queryKey = reactQueryKeyStore.tasks(searchQuery)
      const prevTasks = queryClient.getQueryData<TaskType[]>(queryKey) ?? []
      if (prevTasks.length === 0) return
      const newTasks = prevTasks.map(task =>
        task.id === id ? { ...task, title: newTitle, description: newDescription, duration: newDuration } : task
      )
      queryClient.setQueryData(queryKey, newTasks)
      return {
        callback: () => queryClient.setQueryData(queryKey, prevTasks),
      }
    },
    onError: (error, __, context) => {
      if (context) context.callback()
      console.error(error)
    },
  })

  function handleUpdateTask({ newTitle, newDescription, newDuration }: { newTitle: string; newDescription: string; newDuration: number }) {
    console.log('test')
    mutate({ id: task.id, newDescription, newDuration, newTitle })
  }
  //TODO refactor this into a hook. Maybe with more of the state on top
  useEffect(() => {
    if (pathname !== '/tasks') {
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
        top.value = withTiming((SMALL_HEIGHT + PADDING) * index + SEARCH_BAR_HEIGHT_PADDED)
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
            height: WINDOW_HEIGHT,
            position: 'absolute',
            top: contentOffset - PADDING,
            left: -20,
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
        onPress={e => {
          focused.value = !focused.value
          onItemPress(true)
        }}
        onPressIn={() => {
          scale.value = withTiming(1.05)
        }}
        onPressOut={() => (scale.value = withTiming(1))}
        style={[baseStyle, { backgroundColor: Colors[theme].elevated }, animatedStyle]}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <InputText
            type="title"
            value={task.title}
            editable={focusedState}
            lines={focusedState ? 3 : 1}
            onChangeText={newTitle => {
              if (newTitle === task.title) return
              handleUpdateTask({ newTitle, newDescription: task.description, newDuration: task.duration })
            }}
          />
          {!focusedState && (
            <Animated.View entering={FadeIn} exiting={FadeOut.duration(20)}>
              <Subtitle label={convertDurationToText(task.duration)} />
            </Animated.View>
          )}
        </View>

        <InputText
          type="base"
          value={task.description}
          editable={focusedState}
          lines={3}
          onChangeText={newDescription => {
            if (newDescription === task.description) return
            handleUpdateTask({ newTitle: task.title, newDescription, newDuration: task.duration })
          }}
        />

        {/*  */}
        <View style={{ width: '100%', alignItems: 'center' }}>
          {focusedState && (
            <DurationPicker
              hours={Math.floor(task.duration / 60)}
              minutes={task.duration % 60}
              setHours={(hours: number) => {
                const duration = hours * 60 + (task.duration % 60)
                handleUpdateTask({ newTitle: task.title, newDescription: task.description, newDuration: duration })
              }}
              setMinutes={(minutes: number) => {
                const duration = Math.floor(task.duration / 60) * 60 + minutes
                handleUpdateTask({ newTitle: task.title, newDescription: task.description, newDuration: duration })
              }}
            />
          )}
        </View>
        {focusedState && (
          <TaskItemActionButtons onStart={() => router.push(`/task/${task.id}`)} onDelete={() => alert('implement delete')} />
        )}
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
