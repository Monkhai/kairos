import Screen from '@/components/ui/Screen'
import { cardColorMap, Colors } from '@/constants/Colors'
import { getDefaultsById } from '@/server/userDefaults/queries'
import { useQuery } from '@tanstack/react-query'
import { router, useLocalSearchParams, usePathname } from 'expo-router'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { useColorScheme, View } from 'react-native'
import TaskSelection from './components/TaskSelection'
import reactQueryKeyStore from '@/queries/reactQueryKeyStore'
import { TaskType } from '@/server/tasks/taskTypes'
import ActiveTask from './components/ActiveTask'
import Button from '@/components/ui/Buttons/TextButton'
import { TaskViewHeader } from './components/TaskViewHeader'

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
    <Screen noPadding>
      <Screen.Header>
        <TaskViewHeader
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
            <View
              style={{
                backgroundColor: Colors[theme][cardColorMap[data.color].background],
                flex: 1,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ActiveTask task={task} textColor={Colors[theme][cardColorMap[data.color].text]} />
            </View>
          </Screen.Body>
          <Screen.Footer>
            <View
              style={{
                paddingBottom: 40,
                backgroundColor: Colors[theme][cardColorMap[data.color].background],
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
        </>
      ) : (
        <Screen.Body>
          <TaskSelection duration={data.duration} taskColor={data.color} setTask={setTask} setSelectionFinished={setSelectionFinished} />
        </Screen.Body>
      )}
    </Screen>
  )
}
