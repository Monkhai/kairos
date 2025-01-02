import SearchBar from '@/components/ui/inputs/SearchBar'
import Screen from '@/components/ui/Screen'
import { TaskType } from '@/server/tasks/taskTypes'
import React, { Dispatch, SetStateAction } from 'react'
import { Keyboard, ScrollView, View } from 'react-native'
import TaskItem from './components/TaskItem/TaskItem'
import TextButton from '@/components/ui/Buttons/TextButton'
import { router } from 'expo-router'
import { useAtom } from 'jotai'
import { taskSearchQueryAtom } from '@/jotaiAtoms/tasksAtoms'

interface Props {
  contentOffset: number
  setContentOffset: Dispatch<SetStateAction<number>>
  itemFocus: boolean
  setItemFocus: Dispatch<SetStateAction<boolean>>
  tasks: Array<TaskType>
}
//TODO: show something if user has no tasks
export default function TasksView({ contentOffset, itemFocus, setContentOffset, setItemFocus, tasks }: Props) {
  const [searchQueryFilter] = useAtom(taskSearchQueryAtom)

  return (
    <Screen noPadding>
      <Screen.Body>
        <ScrollView
          scrollEnabled={!itemFocus}
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            setContentOffset(e.nativeEvent.contentOffset.y)
          }}
          onScrollEndDrag={(e) => {
            setContentOffset(e.nativeEvent.contentOffset.y)
          }}
          onTouchStart={() => {
            Keyboard.dismiss()
          }}
          keyboardShouldPersistTaps='handled'
          style={{ width: '100%', paddingHorizontal: '5%' }}
          contentContainerStyle={{ width: '100%', height: tasks.length * 96 + 72, minHeight: '100%' }}
        >
          <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
            <SearchBar />
            {searchQueryFilter === '' ? null : (
              <View style={{ marginVertical: 16, marginLeft: 5 }}>
                <TextButton
                  label={'Choose'}
                  type={'tertiaryButton'}
                  onPress={() => {
                    router.push(`/shortcut/5`)
                  }}
                  size='sm'
                />
              </View>
            )}
          </View>
          {tasks.map((task, index) => (
            <TaskItem
              key={index}
              onItemPress={(isFocused) => setItemFocus(isFocused)}
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
