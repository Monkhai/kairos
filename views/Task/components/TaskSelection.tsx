import { cardColorMap, Colors } from '@/constants/Colors'
import { getTasks } from '@/server/tasks/queries'
import { TaskFilter, TaskOrdering } from '@/server/tasks/queryTypes'
import { convertDurationToText } from '@/views/Home/components/ShortcutCard/utils'
import { useQuery } from '@tanstack/react-query'
import React, { Dispatch, SetStateAction } from 'react'
import { Text, useColorScheme, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import TaskSelectionCard from './TaskSelectionCard'

interface Props {
  duration: number
  taskColor: keyof typeof cardColorMap
  setBackgroundColor: Dispatch<SetStateAction<string>>
}

export default function TaskSelection({ duration, taskColor, setBackgroundColor }: Props) {
  const stringDuration = duration.toString()
  const theme = useColorScheme() ?? 'light'
  const topIndex = useSharedValue(0)

  const [window, setWindow] = React.useState({ start: 0, end: 2 })

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

  return (
    <View style={{ flex: 1, width: '100%' }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          left: '23%',
          top: '30%',
          width: '54%',
          height: '40%',
          zIndex: 0,
        }}
      >
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
          />
        )
      })}
    </View>
  )
}
