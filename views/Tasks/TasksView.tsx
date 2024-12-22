import Screen from '@/components/ui/Screen'
import { TaskType } from '@/server/tasks/taskTypes'
import React, { Dispatch, SetStateAction } from 'react'
import { FlatList } from 'react-native'
import TaskItem from './components/TaskItem/TaskItem'
import InputField from '@/components/ui/inputs/InputField'

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
        <FlatList
          scrollEnabled={!itemFocus}
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={e => {
            setContentOffset(e.nativeEvent.contentOffset.y)
          }}
          onScrollEndDrag={e => {
            setContentOffset(e.nativeEvent.contentOffset.y)
          }}
          keyboardShouldPersistTaps="handled"
          data={tasks}
          renderItem={({ item, index }) => (
            <TaskItem onItemPress={isFocused => setItemFocus(isFocused)} contentOffset={contentOffset} task={item} index={index} />
          )}
          keyExtractor={item => item.id}
          style={{ width: '100%', paddingTop: 16, paddingHorizontal: '5%' }}
          contentContainerStyle={{ width: '100%', height: tasks.length * 96 + 72, minHeight: '100%' }}
        />
      </Screen.Body>
    </Screen>
  )
}
