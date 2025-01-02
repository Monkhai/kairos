import Screen from '@/components/ui/Screen'
import { cardColorMap, Colors } from '@/constants/Colors'
import reactQueryKeyStore from '@/queries/reactQueryKeyStore'
import { TaskType } from '@/server/tasks/taskTypes'
import { getDefaultsById } from '@/server/userDefaults/queries'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import ActiveTaskView from '../Task/ActiveTaskView'
import TaskSelectionView from '../Task/TaskSelectionView'

export default function ShortcutView() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const theme = useColorScheme() ?? 'light'
  const [task, setTask]: [TaskType | undefined, Dispatch<SetStateAction<TaskType | undefined>>] = useState()

  const { data, isLoading, error } = useQuery({
    queryKey: reactQueryKeyStore.defaults(id),
    queryFn: async () => getDefaultsById(Number(id)),
  })

  const bgState = useSharedValue(0)
  const animatedStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      bgState.value,
      [0, 0.1, 1],
      [Colors[theme].background, Colors[theme].backgroundOpaque, Colors[theme][cardColorMap[data?.color ?? 'blue'].background]]
    )
    return {
      backgroundColor: bg,
    }
  })

  useEffect(() => {
    return () => {
      bgState.value = withTiming(0, { duration: 500 })
    }
  }, [])

  if (isLoading || error || !data) {
    console.log(isLoading ? 'Loading...' : error)
    return null
  }

  return (
    <Screen noPadding animatedStyle={animatedStyle}>
      {!!task ? (
        <ActiveTaskView task_id={task.id} color={data.color} />
      ) : (
        <TaskSelectionView task={task} setTask={setTask} userDefault={data} bgState={bgState} />
      )}
    </Screen>
  )
}
