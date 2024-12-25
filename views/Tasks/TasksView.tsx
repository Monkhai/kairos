import SearchBar from '@/components/ui/inputs/SearchBar'
import Screen from '@/components/ui/Screen'
import { TaskType } from '@/server/tasks/taskTypes'
import React, { Dispatch, SetStateAction } from 'react'
import { Keyboard, ScrollView } from 'react-native'
import TaskItem from './components/TaskItem/TaskItem'
import { TaskFilter } from '@/server/tasks/queryTypes'

interface Props {
  contentOffset: number
  setContentOffset: Dispatch<SetStateAction<number>>
  itemFocus: boolean
  setItemFocus: Dispatch<SetStateAction<boolean>>
  tasks: Array<TaskType>
}
//TODO: show something if user has no tasks
export default function TasksView({ contentOffset, itemFocus, setContentOffset, setItemFocus, tasks }: Props) {
  return (
    <Screen noPadding>
      <Screen.Body>
        <ScrollView
          scrollEnabled={!itemFocus}
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={e => {
            setContentOffset(e.nativeEvent.contentOffset.y)
          }}
          onScrollEndDrag={e => {
            setContentOffset(e.nativeEvent.contentOffset.y)
          }}
          onTouchStart={() => {
            Keyboard.dismiss()
          }}
          keyboardShouldPersistTaps="handled"
          style={{ width: '100%', paddingHorizontal: '5%' }}
          contentContainerStyle={{ width: '100%', height: tasks.length * 96 + 72, minHeight: '100%' }}
        >
          <SearchBar />
          {tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              onItemPress={isFocused => setItemFocus(isFocused)}
              contentOffset={contentOffset}
              task={task}
              index={index}
            />
          ))}
        </ScrollView>
      </Screen.Body>
    </Screen>
  )
}
