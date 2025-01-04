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
import { hideDoneAtom, taskSearchQueryAtom, topTaskSelectionScreenIndex } from '@/jotaiAtoms/tasksAtoms'
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
  const theme = useColorScheme() ?? 'light'
  const [jotaiTopIndex] = useAtom(topTaskSelectionScreenIndex)
  const topIndex = useSharedValue(jotaiTopIndex)
  const [noMoreTasks, setNoMoreTasks] = useState(false)
  const [searchQuery] = useAtom(taskSearchQueryAtom)

  const { data, isLoading, error } = useQuery({
    queryKey: reactQueryKeyStore.tasks({ searchQuery }),
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
        return null
      }
      runOnJS(setNoMoreTasks)(topIndex.value === data.length)
    }
  )

  if (isLoading || error || !data) {
    return null
  }

  console.log(data, data.length, noMoreTasks)
  return (
    <View style={{ flex: 1, width: '100%' }}>
      {noMoreTasks || data.length === 0 ? (
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
              opacity: 0.7,
              fontSize: 16,
              marginBottom: 80,
            }}
          >
            {duration >= Number.MAX_SAFE_INTEGER
              ? `There are no more tasks matching you search`
              : `There are no more tasks under ${convertDurationToText(duration)}`}
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
