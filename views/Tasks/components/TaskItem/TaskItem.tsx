// eslint-disable-next-line react-compiler/react-compiler
/* eslint-disable react-hooks/exhaustive-deps */
import { AnimatedPressable } from '@/components/ui/Buttons/utils'
import DurationPicker from '@/components/ui/DurationPicker/DurationPicker'
import InputText from '@/components/ui/inputs/InputText'
import { SEARCH_BAR_HEIGHT_PADDED } from '@/components/ui/inputs/SearchBar'
import Subtitle from '@/components/ui/Text/Subtitle'
import { Colors } from '@/constants/Colors'
import { hideDoneAtom, taskSearchQueryAtom } from '@/jotaiAtoms/tasksAtoms'
import { queryClient } from '@/providers/QueryProvider'
import reactQueryKeyStore from '@/queries/reactQueryKeyStore'
import { deleteTask, updateTask } from '@/server/tasks/queries'
import { TaskType } from '@/server/tasks/taskTypes'
import { convertDurationToText } from '@/views/Home/components/ShortcutCard/utils'
import { SCREEN_HEIGHT, WINDOW_HEIGHT } from '@gorhom/bottom-sheet'
import { useHeaderHeight } from '@react-navigation/elements'
import { useMutation } from '@tanstack/react-query'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import { router, usePathname } from 'expo-router'
import { useAtom } from 'jotai'
import React, { useCallback, useEffect, useMemo } from 'react'
import { Platform, StyleSheet, useColorScheme, View } from 'react-native'
import { FadeOut, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
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
  const pathname = usePathname()
  const [searchQuery] = useAtom(taskSearchQueryAtom)
  const [showDone] = useAtom(hideDoneAtom)
  const [focusedState, setFocusedState] = React.useState(false)

  const scale = useSharedValue(1)
  const focused = useSharedValue(false)
  const zIndex = useSharedValue(0)
  const height = useSharedValue(SMALL_HEIGHT)
  const backdropOpacity = useSharedValue(0)
  const top = useSharedValue((SMALL_HEIGHT + PADDING) * index + SEARCH_BAR_HEIGHT_PADDED)

  const headerHeight = useHeaderHeight()

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
      const queryKey = reactQueryKeyStore.tasks({ searchQuery, showDone })
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: reactQueryKeyStore.baseTasks() })
    },
  })

  useEffect(() => {
    if (pathname !== '/tasks') {
      handleCloseTask()
    }
  }, [pathname])

  const { mutate: deleteTaskMutation } = useMutation({
    mutationFn: async ({ id }: { id: string }) => await deleteTask(id),
    onSuccess: () => {
      const queryKey = reactQueryKeyStore.baseTasks()
      queryClient.invalidateQueries({ queryKey })
    },

    onError: error => {
      console.error(error)
    },
  })

  const handlDeleteTask = () => {
    handleCloseTask()
    deleteTaskMutation({ id: task.id })
  }

  function handleUpdateTask({ newTitle, newDescription, newDuration }: { newTitle: string; newDescription: string; newDuration: number }) {
    mutate({ id: task.id, newDescription, newDuration, newTitle })
  }

  const handleOpenTask = useCallback(() => {
    focused.value = true
    setFocusedState(true)
    onItemPress(true)
    zIndex.value = 2
    const center = Platform.select({
      android: (SCREEN_HEIGHT - headerHeight - LARGE_HEIGHT + contentOffset) / 2,
      default: SCREEN_HEIGHT / 2 - LARGE_HEIGHT + contentOffset,
    })
    height.value = withTiming(LARGE_HEIGHT)
    backdropOpacity.value = withTiming(0.2)
    top.value = withTiming(center)
    impactAsync(ImpactFeedbackStyle.Light)
  }, [contentOffset, WINDOW_HEIGHT])

  const handleCloseTask = useCallback(() => {
    focused.value = false
    setFocusedState(false)
    onItemPress(false)
    top.value = withTiming((SMALL_HEIGHT + PADDING) * index + SEARCH_BAR_HEIGHT_PADDED)
    height.value = withTiming(SMALL_HEIGHT, {}, () => {
      zIndex.value = 0
    })
    backdropOpacity.value = withTiming(0)
  }, [index])

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
  const minutes = useMemo(() => task.duration % 60, [task.duration])
  const hours = useMemo(() => Math.floor(task.duration / 60), [task.duration])
  const setHours = useCallback(
    (hours: number) => {
      const duration = hours * 60 + (task.duration % 60)
      handleUpdateTask({ newTitle: task.title, newDescription: task.description, newDuration: duration })
    },
    [task]
  )
  const setMinutes = useCallback(
    (minutes: number) => {
      const duration = Math.floor(task.duration / 60) * 60 + minutes
      handleUpdateTask({ newTitle: task.title, newDescription: task.description, newDuration: duration })
    },
    [task]
  )

  return (
    <>
      <AnimatedPressable style={[styles.backdrop, { top: contentOffset - PADDING }, animatedBackdropStyle]} onPress={handleCloseTask} />
      <AnimatedPressable
        exiting={FadeOut}
        disabled={focusedState}
        onPress={handleOpenTask}
        style={[styles.base, { backgroundColor: Colors[theme].elevated }, animatedStyle]}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
          <InputText
            type={focusedState ? 'titleHeight' : 'title'}
            placeholder="Title"
            value={task.title}
            editable={focusedState}
            lines={focusedState ? 1 : 3}
            onChangeText={newTitle => {
              if (newTitle === task.title) return
              handleUpdateTask({ newTitle, newDescription: task.description, newDuration: task.duration })
            }}
          />
          {!focusedState && <Subtitle small label={convertDurationToText(task.duration, true)} />}
        </View>
        <InputText
          placeholder="Description"
          type={focusedState ? 'baseHeight' : 'base'}
          value={task.description}
          editable={focusedState}
          lines={3}
          onChangeText={newDescription => {
            if (newDescription === task.description) return
            handleUpdateTask({ newTitle: task.title, newDescription, newDuration: task.duration })
          }}
        />

        <View style={styles.durationPickerContainer}>
          {focusedState && <DurationPicker hours={hours} minutes={minutes} setHours={setHours} setMinutes={setMinutes} />}
        </View>
        {focusedState && <TaskItemActionButtons onStart={() => router.push(`/task/${task.id}`)} onDelete={() => handlDeleteTask()} />}
      </AnimatedPressable>
    </>
  )
}

const styles = StyleSheet.create({
  base: {
    gap: 8,
    width: '100%',
    position: 'absolute',
    paddingVertical: PADDING,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  backdrop: {
    width: WINDOW_HEIGHT * 2,
    height: WINDOW_HEIGHT,
    position: 'absolute',
    left: -0.5 * WINDOW_HEIGHT,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationPickerContainer: {
    width: '100%',
    alignItems: 'center',
  },
})
