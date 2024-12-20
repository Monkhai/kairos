import Screen from '@/components/ui/Screen'
import { TaskType } from '@/server/tasks/taskTypes'
import React from 'react'
import { FlatList } from 'react-native'
import TaskItem from './components/TaskItem'

export default function TasksView() {
  const [contentOffset, setContentOffset] = React.useState(0)
  const [itemFocus, setItemFocus] = React.useState(false)

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
          contentContainerStyle={{ width: '100%', height: tasks.length * 96 + 72 }}
        />
      </Screen.Body>
    </Screen>
  )
}

const tasks: Array<TaskType> = [
  {
    done: false,
    id: '1',
    title: 'Task 1',
    description: 'Task 1 description',
    duration: 70,
  },
  {
    done: false,
    id: '2',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
  {
    done: false,
    id: '13',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
  {
    done: false,
    id: '3',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
  {
    done: false,
    id: '4',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
  {
    done: false,
    id: '5',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
  {
    done: false,
    id: '6',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
  {
    done: false,
    id: '7',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
  {
    done: false,
    id: '8',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
  {
    done: false,
    id: '9',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
  {
    done: false,
    id: '10',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
  {
    done: false,
    id: '11',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
  {
    done: false,
    id: '12',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
]
