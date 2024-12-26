import BackButton from '@/components/ui/Buttons/BackButton'
import { cardColorMap, CardColorMapKey, Colors } from '@/constants/Colors'
import { TaskType } from '@/server/tasks/taskTypes'
import { getDefaultsById } from '@/server/userDefaults/queries'
import { convertDurationToText } from '@/views/Home/components/ShortcutCard/utils'
import { useQuery } from '@tanstack/react-query'
import { useGlobalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { Text, useColorScheme, View } from 'react-native'
import Animated, { FadeIn, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const TASK_VIEW_HEADER_HEIGHT = 98

interface Props {
  backgroundColor: string
  onBack: () => void
  task: TaskType | undefined
  color: CardColorMapKey
  title: string
}
export function TaskViewHeader({ backgroundColor, onBack, task, title, color = 'blue' }: Props) {
  const insets = useSafeAreaInsets()
  const theme = useColorScheme() ?? 'light'

  const bgState = useSharedValue(0)
  const animatedStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(bgState.value, [0, 0.1, 1], [Colors[theme].background, Colors[theme].backgroundOpaque, backgroundColor])
    return {
      backgroundColor: bg,
    }
  })

  useEffect(() => {
    bgState.value = 0
    bgState.value = withTiming(1, { duration: 1000 })
    return () => {
      bgState.value = withTiming(0, { duration: 1000 })
    }
  }, [backgroundColor])
  return (
    <Animated.View
      entering={FadeIn}
      style={[
        {
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 32,
          paddingTop: insets.top,
        },
        animatedStyle,
      ]}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
        <BackButton
          buttonColor={Colors[theme][cardColorMap[color].text]}
          backgroundColor={Colors[theme][cardColorMap[color].text]}
          onBack={onBack}
          widthFraction={0.04}
          heightFraction={0.03}
        />
      </View>
      <Text
        style={{
          textAlign: 'center',
          fontWeight: 700,
          color: Colors[theme][cardColorMap[color].text],
          fontSize: 30,
        }}
      >
        {title}
      </Text>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
      <View />
    </Animated.View>
  )
}
