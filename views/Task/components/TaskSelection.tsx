import { Colors } from '@/constants/Colors'
import { getTasks } from '@/server/tasks/queries'
import { TaskFilter, TaskOrdering } from '@/server/tasks/queryTypes'
import { useQuery } from '@tanstack/react-query'
import React, { Dispatch, SetStateAction } from 'react'
import { useColorScheme, Text, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import TaskSelectionCard from './TaskSelectionCard'
import { convertDurationToText } from '@/views/Home/components/ShortcutCard/utils'
import { router } from 'expo-router'
import BackButton from '@/components/ui/Buttons/BackButton'
import { colorMap } from '../TaskView'
import { TaskType } from '@/server/tasks/taskTypes'

interface Props {
  duration: number
  taskColor: keyof typeof colorMap
  setSelectionFinished: Dispatch<SetStateAction<boolean>>
  setTask: Dispatch<SetStateAction<TaskType | undefined>>
}

export default function TaskSelection({ duration, taskColor, setSelectionFinished, setTask }: Props) {
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
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: '5%',
          left: '7%',
          height: '15%',
        }}
      >
        <BackButton
          buttonColor={Colors[theme][colorMap[taskColor].text]}
          backgroundColor={Colors[theme].background}
          backFunction={() => router.back()}
          widthFraction={0.04}
          heightFraction={0.03}
        />
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: '5%',
          left: '15%',
          width: '70%',
          height: '15%',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 700,
            color: Colors[theme][colorMap[taskColor].text],
            fontSize: 30,
          }}
        >
          {convertDurationToText(duration)}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          left: '24%',
          top: '30%',
          width: '52%',
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
            backgroundColor={Colors[theme][colorMap[taskColor].background]}
            textColor={Colors[theme][colorMap[taskColor].text]}
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
  )
}
