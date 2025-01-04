import { View } from 'react-native'
import React, { Dispatch } from 'react'
import Screen from '@/components/ui/Screen'
import { TaskViewHeader } from '../Shortcuts/components/TaskViewHeader'
import { convertDurationToText } from '../Home/components/ShortcutCard/utils'
import TaskSelection from './components/TaskSelection'
import { TaskType } from '@/server/tasks/taskTypes'
import { SetStateAction } from 'jotai'
import { Default } from '@/server/userDefaults/defaultsTypes'
import { SharedValue, withTiming } from 'react-native-reanimated'
import { router } from 'expo-router'

interface Props {
  task: TaskType | undefined
  setTask: Dispatch<SetStateAction<TaskType | undefined>>
  userDefault: Default
  bgState: SharedValue<number>
}

export default function TaskSelectionView({ task, setTask, userDefault, bgState }: Props) {
  return (
    <Screen noPadding>
      <Screen.Header>
        <TaskViewHeader
          title={convertDurationToText(userDefault.duration)}
          color={userDefault.color}
          onBack={() => {
            if (!!task) {
              setTask(undefined)
              bgState.value = withTiming(0, { duration: 500 })
            } else {
              router.back()
            }
          }}
        />
      </Screen.Header>
      <Screen.Body>
        <TaskSelection
          duration={userDefault.duration}
          taskColor={userDefault.color}
          setTask={(v) => {
            if (v) {
              bgState.value = 0
              bgState.value = withTiming(1, { duration: 500 })
            }
            setTask(v)
          }}
        />
      </Screen.Body>
    </Screen>
  )
}
