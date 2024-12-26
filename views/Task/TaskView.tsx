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
import { TaskViewHeader } from '../Shortcuts/components/TaskViewHeader'
import { getTask } from '@/server/tasks/queries'

export default function TaskView() {
  const { task_id } = useLocalSearchParams<{ task_id: string }>()
  const theme = useColorScheme() ?? 'light'

  const {
    data: task,
    isLoading,
    error,
  } = useQuery({
    queryKey: reactQueryKeyStore.oneTask(task_id),
    queryFn: async () => await getTask(task_id),
  })

  //TODO: separate loading from error
  if (isLoading || error || !task) {
    console.log(error)
    return null
  }

  return (
    <Screen noPadding>
      <Screen.Header>
        <TaskViewHeader
          title={task.title}
          color="purple"
          backgroundColor={task ? Colors[theme][cardColorMap.purple.background] : Colors[theme].background}
          onBack={() => {
            router.back()
          }}
          task={task}
        />
      </Screen.Header>
      <Screen.Body>
        <View
          style={{
            backgroundColor: Colors[theme][cardColorMap.purple.background],
            flex: 1,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActiveTask task={task} textColor={Colors[theme][cardColorMap.purple.text]} />
        </View>
      </Screen.Body>
      <Screen.Footer>
        <View
          style={{
            paddingBottom: 40,
            backgroundColor: Colors[theme][cardColorMap.purple.background],
            flex: 1,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            label="Cancel"
            type="dangerButton"
            onPress={() => {
              router.back()
            }}
          />
        </View>
      </Screen.Footer>
    </Screen>
  )
}
