import { cardColorMap, Colors } from '@/constants/Colors'
import { taskSearchQueryAtom, topTaskSelectionScreenIndex } from '@/jotaiAtoms/tasksAtoms'
import reactQueryKeyStore from '@/queries/reactQueryKeyStore'
import { getTasks } from '@/server/tasks/queries'
import { TaskFilter, TaskOrdering } from '@/server/tasks/queryTypes'
import { TaskType } from '@/server/tasks/taskTypes'
import { convertDurationToText } from '@/views/Home/components/ShortcutCard/utils'
import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { Text, useColorScheme, View } from 'react-native'
import Animated, { FadeIn, FadeOut, runOnJS, useAnimatedReaction, useSharedValue, withTiming } from 'react-native-reanimated'
import TaskSelectionCard from './TaskSelectionCard'
import Button from '@/components/ui/Buttons/TextButton'

interface Props {
  duration: number
  taskColor: keyof typeof cardColorMap
  setTask: Dispatch<SetStateAction<TaskType | undefined>>
}

export default function TaskSelection({ duration, taskColor, setTask }: Props) {
  const theme = useColorScheme() ?? 'light'
  const [jotaiTopIndex, setJotaiTopIndex] = useAtom(topTaskSelectionScreenIndex)
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

  return (
    <View style={{ flex: 1, width: '100%' }}>
      {noMoreTasks || data.length === 0 ? (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={{
            flex: 1,
            width: '100%',
            paddingHorizontal: '5%',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              marginBottom: 80,
              color: Colors[theme].text,
            }}
          >
            {duration >= Number.MAX_SAFE_INTEGER
              ? `There are no more tasks matching you search`
              : `There are no more tasks under ${convertDurationToText(duration)}`}
          </Text>
          <View style={{ width: '50%', alignSelf: 'center' }}>
            <Button
              label="Restart"
              onPress={() => {
                setTask(undefined)
                setNoMoreTasks(false)
                topIndex.value = withTiming(0, { duration: 500 })
                setJotaiTopIndex(0)
              }}
            />
          </View>
        </Animated.View>
      ) : (
        <View style={{ flex: 1 }}>
          {/* TODO: fix why this is not working directly from the data */}
          {data.map((task, index, array) => {
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
