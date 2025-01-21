import Screen from '@/components/ui/Screen'
import { TaskType } from '@/server/tasks/taskTypes'
import { Default } from '@/server/userDefaults/defaultsTypes'
import { router } from 'expo-router'
import { SetStateAction } from 'jotai'
import React, { Dispatch } from 'react'
import { SharedValue, withTiming } from 'react-native-reanimated'
import { convertDurationToText } from '../Home/components/ShortcutCard/utils'
import { TaskViewHeader } from '../Shortcuts/components/TaskViewHeader'
import TaskSelection from './components/TaskSelection'

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
          title={convertDurationToText(userDefault.duration) + userDefault.overUnder === 'Over' ? ' +' : ''}
          color={userDefault.color}
          onBack={() => {
            if (!!task) {
              setTask(undefined)
              bgState.set(withTiming(0, { duration: 500 }))
            } else {
              router.back()
            }
          }}
        />
      </Screen.Header>
      <Screen.Body>
        <TaskSelection
          duration={userDefault.duration}
          overUnder={userDefault.overUnder}
          taskColor={userDefault.color}
          setTask={(v) => {
            if (v) {
              bgState.set(withTiming(0, { duration: 500 }))
              bgState.set(withTiming(1, { duration: 500 }))
            }
            setTask(v)
          }}
        />
      </Screen.Body>
    </Screen>
  )
}
