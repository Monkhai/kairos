import Screen from '@/components/ui/Screen'
import { TaskType } from '@/server/tasks/taskTypes'
import React from 'react'
import { FlatList } from 'react-native'
import TaskItem from './components/TaskItem'
import { useNavigation, usePathname } from 'expo-router'

export default function TasksView() {
  const [contentOffset, setContentOffset] = React.useState(0)
  const [listHeight, setListHeight] = React.useState(0)
  const [itemFocus, setItemFocus] = React.useState(false)

  return (
    <>
      <Screen noPadding>
        <Screen.Body>
          <FlatList
            scrollEnabled={!itemFocus}
            onLayout={e => {
              setListHeight(e.nativeEvent.layout.height)
            }}
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
              <TaskItem
                onItemPress={() => setItemFocus(!itemFocus)}
                listHeight={listHeight}
                contentOffset={contentOffset}
                task={item}
                index={index}
              />
            )}
            keyExtractor={item => item.id}
            style={{ width: '100%', paddingTop: 16, paddingHorizontal: '5%' }}
            contentContainerStyle={{ width: '100%', height: tasks.length * 96 + 72 }}
          />
        </Screen.Body>
      </Screen>
    </>
  )
}

const task = {
  id: '1',
  title: 'Task 1',
  description: 'Task 1 description',
  duration: 70,
}

const tasks: Array<TaskType> = [
  {
    id: '1',
    title: 'Task 1',
    description: 'Task 1 description',
    duration: 70,
  },
  {
    id: '2',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
  {
    id: '13',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
  {
    id: '3',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
  {
    id: '4',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
  {
    id: '5',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
  {
    id: '6',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
  {
    id: '7',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
  {
    id: '8',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
  {
    id: '9',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
  {
    id: '10',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
  {
    id: '11',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
  {
    id: '12',
    title: 'Task 2',
    description: 'Task 2 description',
    duration: 70,
  },
]
