import Button from '@/components/ui/Buttons/TextButton'
import Screen from '@/components/ui/Screen'
import { cardColorMap, Colors } from '@/constants/Colors'
import reactQueryKeyStore from '@/queries/reactQueryKeyStore'
import { getTask } from '@/server/tasks/queries'
import { useQuery } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { TaskViewHeader } from '../Shortcuts/components/TaskViewHeader'
import ActiveTask from './components/ActiveTask'

export default function TaskView() {
  const { task_id } = useLocalSearchParams<{ task_id: string }>()
  const theme = useColorScheme() ?? 'light'
  const bgState = useSharedValue(0)

  const {
    data: task,
    isLoading,
    error,
  } = useQuery({
    queryKey: reactQueryKeyStore.oneTask(task_id),
    queryFn: async () => await getTask(task_id),
  })

  const animatedStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      bgState.value,
      [0, 0.1, 1],
      [Colors[theme].background, Colors[theme].backgroundOpaque, Colors[theme][cardColorMap.purple.background]]
    )
    return {
      backgroundColor: bg,
    }
  })

  useEffect(() => {
    bgState.value = withTiming(1, { duration: 500 })
    return () => {
      bgState.value = withTiming(0, { duration: 500 })
    }
  }, [])

  //TODO: separate loading from error
  if (isLoading || error || !task) {
    return null
  }

  return (
    <Screen noPadding animatedStyle={animatedStyle}>
      <Screen.Header>
        <TaskViewHeader
          title={task.title}
          color="purple"
          onBack={() => {
            router.back()
            bgState.value = withTiming(0, { duration: 500 })
          }}
        />
      </Screen.Header>
      <Screen.Body>
        <Animated.View
          style={[
            {
              flex: 1,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <ActiveTask task={task} textColor={Colors[theme][cardColorMap.purple.text]} />
        </Animated.View>
      </Screen.Body>
      <Screen.Footer>
        <Animated.View
          style={[
            {
              paddingBottom: 40,
              flex: 1,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <Button
            label="Cancel"
            type="dangerButton"
            onPress={() => {
              router.back()
            }}
          />
        </Animated.View>
      </Screen.Footer>
    </Screen>
  )
}
