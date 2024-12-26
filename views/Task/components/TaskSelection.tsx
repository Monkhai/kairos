import { cardColorMap, Colors } from '@/constants/Colors'
import { getTasks } from '@/server/tasks/queries'
import { TaskFilter, TaskOrdering } from '@/server/tasks/queryTypes'
import { convertDurationToText } from '@/views/Home/components/ShortcutCard/utils'
import { useQuery } from '@tanstack/react-query'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { useColorScheme, View } from 'react-native'
import { FadeIn, runOnJS, useAnimatedReaction, useSharedValue } from 'react-native-reanimated'
import TaskSelectionCard from './TaskSelectionCard'
import { TaskType } from '@/server/tasks/taskTypes'
import { useHeaderHeight } from '@react-navigation/elements'
import Animated from 'react-native-reanimated'
import { useAtom } from 'jotai'
import { taskSearchQueryAtom, topTaskSelectionScreenIndex } from '@/jotaiAtoms/tasksAtoms'
import { scaleZetaToMatchClamps } from 'react-native-reanimated/lib/typescript/animation/springUtils'
import reactQueryKeyStore from '@/queries/reactQueryKeyStore'
import { getDefaultsById } from '@/server/userDefaults/queries'
import { useLocalSearchParams } from 'expo-router'

interface Props {
  duration: number
  taskColor: keyof typeof cardColorMap
  setTask: Dispatch<SetStateAction<TaskType | undefined>>
}

export default function TaskSelection({ duration, taskColor, setTask }: Props) {
  const stringDuration = duration.toString()
  const theme = useColorScheme() ?? 'light'
  const [jotaiTopIndex] = useAtom(topTaskSelectionScreenIndex)
  const topIndex = useSharedValue(jotaiTopIndex)
  const [noMoreTasks, setNoMoreTasks] = useState(false)
  const headerHeight = useHeaderHeight()
  const [searchQuery] = useAtom(taskSearchQueryAtom)

  const { data, isLoading, error } = useQuery({
    queryKey: reactQueryKeyStore.tasks(searchQuery ? searchQuery : duration.toString()),
    queryFn: async () => {
      const filter = new TaskFilter('duration', '<=', duration.toString())
      const ordering = new TaskOrdering('duration', 'ASC')

      return await getTasks(searchQuery, [filter], [ordering])
    },
  })

  useAnimatedReaction(
    () => topIndex.value,
    () => {
      if (isLoading || error || !data) {
        console.log(isLoading ? 'Loading...' : error)
        return null
      }
      runOnJS(setNoMoreTasks)(topIndex.value === data.length)
    }
  )

  if (isLoading || error || !data) {
    console.log(isLoading ? 'Loading...' : error)
    return null
  }

  return (
    <View style={{ flex: 1, width: '100%' }}>
      {noMoreTasks ? (
        <View
          style={{
            flex: 1,
            width: '100%',
            paddingHorizontal: '5%',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          <Animated.Text
            entering={FadeIn}
            style={{
              textAlign: 'center',
              color: Colors[theme].text,
              opacity: 0.7,
              fontSize: 16,
              marginBottom: 80,
            }}
          >
            There are no more tasks under {convertDurationToText(duration)}
          </Animated.Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {Array.from(data).map((task, index, array) => {
            return (
              <TaskSelectionCard
                key={index}
                backgroundColor={Colors[theme][cardColorMap[taskColor].background]}
                textColor={Colors[theme][cardColorMap[taskColor].text]}
                index={index}
                topIndex={topIndex}
                cardsNumber={array.length}
                task={task}
                setTask={setTask}
              />
            )
          })}
        </View>
      )}
    </View>
  )
}
