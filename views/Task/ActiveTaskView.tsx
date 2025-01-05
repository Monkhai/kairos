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
  const [isFinished, setIsFinished] = useState(false)
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

  const setPausedState = (newPaused: boolean) => {
    setPaused(newPaused)
    if (!newPaused) {
      pausedState.value = withTiming(1, { duration: 200 })
    }
    if (newPaused) {
      pausedState.value = withTiming(0, { duration: 200 })
    }
  }

  const { mutate: markTaskAsDoneMutation, isPending } = useMutation({
    mutationFn: async ({ id }: { id: string }) => await markTaskAsDone(id),
    onSuccess: () => {
      const queryKey = reactQueryKeyStore.tasks({ searchQuery, showDone })
      queryClient.refetchQueries({ queryKey })
    },

    onError: error => {
      console.error(error)
    },
  })

  const hanleMarkTaskAsDone = () => {
    markTaskAsDoneMutation({ id: task_id })
    setIsFinished(true)
  }

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
          color={color}
          onBack={() => {
            const initialState = paused
            setPausedState(true)
            Alert.alert('Exit Active?', 'When existing, the state of the task will not be saved', [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {
                  setPausedState(initialState)
                },
              },
              {
                text: 'OK',
                onPress: () => {
                  router.back()
                  bgState.value = withTiming(0, { duration: 500 })
                },
              },
            ])
          }}
        />
      </Screen.Header>
      <Screen.Body>
        <ActiveTask
          task={task}
          textColor={Colors[theme][cardColorMap[color].text]}
          paused={paused}
          isFinished={isFinished}
          setIsFinished={setIsFinished}
        />
      </Screen.Body>
      <Screen.Footer>
        <Animated.View entering={FadeIn} style={styles.footerContainer}>
          {isFinished ? (
            <Button label="Back to Home Page" type="primaryButton" onPress={router.dismissAll} />
          ) : (
            <>
              <Button
                label={paused ? 'Resume' : 'Pause'}
                type={paused ? 'successButton' : 'dangerButton'}
                onPress={() => setPausedState(!paused)}
                animatedColors={{
                  colors: [Colors[theme].successButton, Colors[theme].dangerButton],
                  value: pausedState,
                }}
                size="sm"
              />
              <View style={{ width: 20 }} />
              <Button label="Done" type="primaryButton" onPress={hanleMarkTaskAsDone} size="sm" />
            </>
          )}
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
