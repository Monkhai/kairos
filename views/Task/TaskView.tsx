import Button from '@/components/ui/Buttons/TextButton'
import Screen from '@/components/ui/Screen'
import { Colors } from '@/constants/Colors'
import { router, useLocalSearchParams, usePathname } from 'expo-router'
import React from 'react'
import { useColorScheme, View } from 'react-native'
import ActiveTask from './components/ActiveTask'
import TaskSelection from './components/TaskSelection'
import { useQuery } from '@tanstack/react-query'
import reactQueryKeyStore from '@/queries/reactQueryKeyStore'
import { getDefaultsById } from '@/server/userDefaults/queries'

export default function TaskView() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const pathname = usePathname()
  const theme = useColorScheme() ?? 'light'
  const [backgroundColor, setBackgroundColor] = React.useState(Colors[theme].background)

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
      {/* <Screen.Body>
        <View style={{ backgroundColor, flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <ActiveTask />
        </View>
      </Screen.Body>
      <Screen.Footer>
        <View style={{ paddingBottom: 40, backgroundColor, flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Button
            label='Cancel'
            type='dangerButton'
            onPress={() => {
              router.back()
            }}
          />
        </View>
      </Screen.Footer> */}
      <Screen.Body>
        <TaskSelection duration={data.duration} taskColor={data.color} setBackgroundColor={setBackgroundColor} />
      </Screen.Body>
    </Screen>
  )
}
