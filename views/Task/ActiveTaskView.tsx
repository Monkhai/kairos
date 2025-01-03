import Button from '@/components/ui/Buttons/TextButton'
import Screen from '@/components/ui/Screen'
import { cardColorMap, CardColorMapKey, Colors } from '@/constants/Colors'
import { queryClient } from '@/providers/QueryProvider'
import reactQueryKeyStore from '@/queries/reactQueryKeyStore'
import { getTask, markTaskAsDone } from '@/server/tasks/queries'
import { useMutation, useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, useColorScheme, View } from 'react-native'
import Animated, { FadeIn, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { TaskViewHeader } from '../Shortcuts/components/TaskViewHeader'
import ActiveTask from './components/ActiveTask'
import { hideDoneAtom as hideDoneAtom, taskSearchQueryAtom } from '@/jotaiAtoms/tasksAtoms'
import { useAtom } from 'jotai'

interface Props {
  task_id: string
  color: CardColorMapKey
}

export default function ActiveTaskView({ task_id, color }: Props) {
  const theme = useColorScheme() ?? 'light'
  const bgState = useSharedValue(0)
  const pausedState = useSharedValue(1)
  const [paused, setPaused] = useState(false)
  const [showDone] = useAtom(hideDoneAtom)
  const [searchQuery] = useAtom(taskSearchQueryAtom)

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
      [Colors[theme].background, Colors[theme].backgroundOpaque, Colors[theme][cardColorMap[color].background]]
    )
    return {
      backgroundColor: bg,
    }
  })

  const { mutate: markTaskAsDoneMutation, isPending } = useMutation({
    mutationFn: async ({ id }: { id: string }) => await markTaskAsDone(id),
    onSuccess: () => {
      const queryKey = reactQueryKeyStore.tasks({ searchQuery, showDone })
      queryClient.refetchQueries({ queryKey })
      router.dismissTo('/tasks')
    },

    onError: error => {
      console.error(error)
    },
  })

  const hanleMarkTaskAsDone = () => {
    markTaskAsDoneMutation({ id: task_id })
  }

  useEffect(() => {
    bgState.value = withTiming(1, { duration: 500 })
    return () => {
      bgState.value = withTiming(0, { duration: 500 })
    }
  }, [])

  function handleBack() {
    Alert.alert('Exit active?', 'When existing, the state of the task will not be saved', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          router.back()
          bgState.value = withTiming(0, { duration: 500 })
        },
      },
    ])
  }

  //TODO: separate loading from error
  if (isLoading || error || !task) {
    return null
  }

  return (
    <Screen noPadding animatedStyle={animatedStyle}>
      <Screen.Header>
        <TaskViewHeader title={task.title} color={color} onBack={handleBack} />
      </Screen.Header>
      <Screen.Body>
        <ActiveTask task={task} textColor={Colors[theme][cardColorMap[color].text]} paused={paused} />
      </Screen.Body>
      <Screen.Footer>
        <Animated.View entering={FadeIn} style={styles.footerContainer}>
          <Button
            label={paused ? 'Resume' : 'Pause'}
            type={paused ? 'successButton' : 'dangerButton'}
            onPress={() => {
              setPaused(!paused)
              if (paused) {
                pausedState.value = withTiming(1, { duration: 200 })
              }
              if (!paused) {
                pausedState.value = withTiming(0, { duration: 200 })
              }
            }}
            animatedColors={{
              colors: [Colors[theme].successButton, Colors[theme].dangerButton],
              value: pausedState,
            }}
            size="sm"
          />
          <View style={{ width: 20 }} />
          <Button label="Done" type="primaryButton" onPress={hanleMarkTaskAsDone} size="sm" />
        </Animated.View>
      </Screen.Footer>
    </Screen>
  )
}

const styles = StyleSheet.create({
  footerContainer: {
    paddingBottom: 40,
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
