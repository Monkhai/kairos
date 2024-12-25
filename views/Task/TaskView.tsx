import Button from '@/components/ui/Buttons/TextButton'
import Screen from '@/components/ui/Screen'
import { Colors, ThemeColor } from '@/constants/Colors'
import { router, useLocalSearchParams, usePathname } from 'expo-router'
import React from 'react'
import { Text, useColorScheme, View } from 'react-native'
import ActiveTask from './components/ActiveTask'
import TaskSelection from './components/TaskSelection'
import { useQuery } from '@tanstack/react-query'
import reactQueryKeyStore from '@/queries/reactQueryKeyStore'
import { getDefaultsById } from '@/server/userDefaults/queries'
import BackButton from '@/components/ui/Buttons/BackButton'
import { convertDurationToText } from '../Home/components/ShortcutCard/utils'

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
    <Screen>
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
      <Screen.Header>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 32,
          }}
        >
          <BackButton
            color={Colors[theme][colorMap[data.color].text]}
            backFunction={() => router.back()}
            widthFraction={0.04}
            heightFraction={0.03}
          />
          <Text
            style={{
              textAlign: 'center',
              fontWeight: 700,
              color: Colors[theme][colorMap[data.color].text],
              fontSize: 30,
            }}
          >
            {convertDurationToText(data.duration)}
          </Text>
          <View />
        </View>
      </Screen.Header>
      <Screen.Body>
        <TaskSelection duration={data.duration} taskColor={data.color} setBackgroundColor={setBackgroundColor} />
      </Screen.Body>
    </Screen>
  )
}

const colorMap: Record<string, CardColors> = {
  blue: {
    background: 'primaryBackground',
    text: 'primaryElevated',
  },
  orange: {
    background: 'secondaryBackground',
    text: 'secondaryElevated',
  },
  green: {
    background: 'successBackground',
    text: 'successElevated',
  },
  red: {
    background: 'dangerBackground',
    text: 'dangerElevated',
  },
}
type CardColors = {
  background: ThemeColor
  text: ThemeColor
}
