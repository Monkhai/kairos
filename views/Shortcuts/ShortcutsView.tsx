import Button from '@/components/ui/Buttons/TextButton'
import Screen from '@/components/ui/Screen'
import { cardColorMap, Colors } from '@/constants/Colors'
import reactQueryKeyStore from '@/queries/reactQueryKeyStore'
import { TaskType } from '@/server/tasks/taskTypes'
import { getDefaultsById } from '@/server/userDefaults/queries'
import { useQuery } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useColorScheme, View } from 'react-native'
import Animated, { FadeIn, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { convertDurationToText } from '../Home/components/ShortcutCard/utils'
import ActiveTask from '../Task/components/ActiveTask'
import TaskSelection from '../Task/components/TaskSelection'
import { TaskViewHeader } from './components/TaskViewHeader'

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
      [0, 0, 1, 1],
      [Colors[theme].background, Colors[theme].backgroundOpaque, Colors[theme][cardColorMap[data?.color ?? 'blue'].background]],
      'RGB',
      {}
    )
    return {
      backgroundColor: bg,
    }
  })

  useEffect(() => {
    return () => {
      bgState.value = withTiming(0, { duration: 1000 })
    }
  }, [])

  if (isLoading || error || !data) {
    console.log(isLoading ? 'Loading...' : error)
    return null
  }

  return (
    <Screen noPadding>
      <Screen.Header>
        <TaskViewHeader
          title={task ? task.title : id === '5' ? 'Search' : convertDurationToText(data.duration)}
          color={data.color}
          backgroundColor={task ? Colors[theme][cardColorMap[data.color].background] : Colors[theme].background}
          onBack={() => {
            if (!!task) {
              setTask(undefined)
            } else {
              router.back()
            }
          }}
          task={task}
        />
      </Screen.Header>
      {task ? (
        <>
          <Screen.Body>
            <Animated.View
              entering={FadeIn}
              style={[
                {
                  flex: 1,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                animatedStyle,
              ]}
            >
              <ActiveTask task={task} textColor={Colors[theme][cardColorMap[data.color].text]} />
            </Animated.View>
          </Screen.Body>
          <Screen.Footer>
            <Animated.View
              entering={FadeIn}
              style={[
                {
                  paddingBottom: 40,
                  flex: 1,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                animatedStyle,
              ]}
            >
              <Button
                label='Cancel'
                type='dangerButton'
                onPress={() => {
                  router.back()
                }}
              />
            </Animated.View>
          </Screen.Footer>
        </>
      ) : (
        <Screen.Body>
          <TaskSelection
            duration={data.duration}
            taskColor={data.color}
            setTask={(v) => {
              if (v) {
                bgState.value = 0
                bgState.value = withTiming(1, { duration: 1000 })
              }
              setTask(v)
            }}
          />
        </Screen.Body>
      )}
    </Screen>
  )
}
