import Button from '@/components/ui/Buttons/TextButton'
import Screen from '@/components/ui/Screen'
import { Colors, ThemeColor } from '@/constants/Colors'
import { router, useLocalSearchParams } from 'expo-router'
import { Dispatch, SetStateAction, useState } from 'react'
import { Task, useColorScheme, View } from 'react-native'
import ActiveTask from './components/ActiveTask'
import TaskSelection from './components/TaskSelection'
import { useQuery } from '@tanstack/react-query'
import { getDefaultsById } from '@/server/userDefaults/queries'
import { TaskType } from '@/server/tasks/taskTypes'

type CardColors = {
  background: ThemeColor
  text: ThemeColor
}

export const colorMap: Record<string, CardColors> = {
  blue: {
    background: 'primaryBackground',
    text: 'primaryElevated',
  },
  orange: {
    background: 'secondaryBackground',
    text: 'secondaryElevated',
  },
  green: {
    background: 'successBackground',
    text: 'successElevated',
  },
  red: {
    background: 'dangerBackground',
    text: 'dangerElevated',
  },
}

export default function TaskView() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const theme = useColorScheme() ?? 'light'
  const [selectionFinished, setSelectionFinished] = useState(false)
  const [task, setTask]: [TaskType | undefined, Dispatch<SetStateAction<TaskType | undefined>>] = useState()

  const { data, isLoading, error } = useQuery({
    queryKey: ['defaults', id],
    queryFn: async () => getDefaultsById(Number(id)),
  })

  if (isLoading || error || !data) {
    console.log(isLoading ? 'Loading...' : error)
    return null
  }

  return (
    <View style={{ flex: 1, width: '100%' }}>
      {!selectionFinished ? (
        <Screen noPadding>
          <Screen.Body>
            <TaskSelection duration={data.duration} taskColor={data.color} setSelectionFinished={setSelectionFinished} setTask={setTask} />
          </Screen.Body>
        </Screen>
      ) : (
        <Screen noPadding noHeader>
          <Screen.Body>
            <View
              style={{
                backgroundColor: Colors[theme][colorMap[data.color].background],
                flex: 1,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ActiveTask task={task} textColor={Colors[theme][colorMap[data.color].text]} />
            </View>
          </Screen.Body>
          <Screen.Footer>
            <View
              style={{
                paddingBottom: 40,
                backgroundColor: Colors[theme][colorMap[data.color].background],
                flex: 1,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button
                label='Cancel'
                type='dangerButton'
                onPress={() => {
                  router.back()
                }}
              />
            </View>
          </Screen.Footer>
        </Screen>
      )}
    </View>
  )
}
