import { cardColorMap, Colors } from '@/constants/Colors'
import { getTasks } from '@/server/tasks/queries'
import { TaskFilter, TaskOrdering } from '@/server/tasks/queryTypes'
import { convertDurationToText } from '@/views/Home/components/ShortcutCard/utils'
import { useQuery } from '@tanstack/react-query'
import React, { Dispatch, SetStateAction } from 'react'
import { Text, useColorScheme, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import TaskSelectionCard from './TaskSelectionCard'
import { TaskType } from '@/server/tasks/taskTypes'
import { useHeaderHeight } from '@react-navigation/elements'

interface Props {
  duration: number
  taskColor: keyof typeof cardColorMap
  setTask: Dispatch<SetStateAction<TaskType | undefined>>
  setSelectionFinished: Dispatch<SetStateAction<boolean>>
}

export default function TaskSelection({ duration, taskColor, setTask, setSelectionFinished }: Props) {
  const stringDuration = duration.toString()
  const theme = useColorScheme() ?? 'light'
  const topIndex = useSharedValue(0)

  const { data, isLoading, error } = useQuery({
    queryKey: ['tasks', stringDuration],
    queryFn: async () => {
      const filter = new TaskFilter('duration', '<=', stringDuration)
      const ordering = new TaskOrdering('duration', 'ASC')

      return await getTasks([filter], [ordering])
    },
    refetchOnMount: true,
  })

  if (isLoading || error || !data) {
    console.log(isLoading ? 'Loading...' : error)
    return null
  }

  const headerHeight = useHeaderHeight()
  return (
    <View style={{ flex: 1, width: '100%' }}>
      <View>
        <Text
          style={{
            textAlign: 'center',
            color: Colors[theme].text,
            opacity: 0.7,
            fontSize: 16,
          }}
        >
          There are no more tasks under {convertDurationToText(duration)}
        </Text>
      </View>
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
              setSelectionFinished={setSelectionFinished}
            />
          )
        })}
      </View>
    </View>
  )
}
