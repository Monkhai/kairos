import SearchBar from '@/components/ui/inputs/SearchBar'
import Screen from '@/components/ui/Screen'
import { TaskType } from '@/server/tasks/taskTypes'
import React, { Dispatch, SetStateAction } from 'react'
import { Keyboard, ScrollView, Text, useColorScheme, View } from 'react-native'
import TaskItem from './components/TaskItem/TaskItem'
import { router, usePathname } from 'expo-router'
import { useAtom } from 'jotai'
import { taskSearchQueryAtom } from '@/jotaiAtoms/tasksAtoms'
import TimerButton from '@/components/ui/Buttons/TimerButton'
import { Colors } from '@/constants/Colors'

interface Props {
  contentOffset: number
  setContentOffset: Dispatch<SetStateAction<number>>
  itemFocus: boolean
  setItemFocus: Dispatch<SetStateAction<boolean>>
  tasks: Array<TaskType>
}

export default function TasksView({ contentOffset, itemFocus, setContentOffset, setItemFocus, tasks }: Props) {
  const [searchQueryFilter] = useAtom(taskSearchQueryAtom)
  const theme = useColorScheme() ?? 'light'

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
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
            <SearchBar />
            {searchQueryFilter === '' || tasks.length == 0 ? null : (
              <View style={{ marginVertical: 16, marginLeft: 5 }}>
                <TimerButton
                  onPress={() => {
                    router.push(`/shortcut/5`)
                  }}
                  size={48}
                />
              </View>
            )}
          </View>
          {tasks.length === 0 ? (
            <View
              style={{
                flex: 1,
                width: '100%',
                paddingHorizontal: '5%',
                alignContent: 'center',
                justifyContent: 'center',
                marginBottom: 160,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  opacity: 0.7,
                  fontSize: 16,
                  color: Colors[theme].text,
                }}
              >
                {searchQueryFilter ? 'There are no tasks matching your search' : 'You have no tasks'}
              </Text>
            </View>
          ) : (
            tasks.map((task, index) => (
              <TaskItem
                key={index}
                onItemPress={isFocused => setItemFocus(isFocused)}
                contentOffset={contentOffset}
                task={task}
                index={index}
              />
            ))
          )}
        </ScrollView>
      </Screen.Body>
    </Screen>
  )
}
