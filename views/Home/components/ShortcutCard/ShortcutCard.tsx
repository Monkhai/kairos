import { Text } from 'react-native'
import React from 'react'
import { AnimatedPressable, useAnimatedButtonStyle } from '@/components/ui/Buttons/utils'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import { Colors } from '@/constants/Colors'
import { withTiming } from 'react-native-reanimated'
import { convertDurationToText } from './utils'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { router } from 'expo-router'
import { getDefaultsById } from '@/server/userDefaults/queries'
import { useQuery } from '@tanstack/react-query'
import reactQueryKeyStore from '@/queries/reactQueryKeyStore'
import { useAtom } from 'jotai'
import { topTaskSelectionScreenIndex } from '@/jotaiAtoms/tasksAtoms'

interface Props {
  id: 1 | 2 | 3 | 4
}
export default function ShortcutCard({ id }: Props) {
  const { animatedStyle, scale } = useAnimatedButtonStyle()
  const [, setTopTaskSelectionScreenIndex] = useAtom(topTaskSelectionScreenIndex)
  const theme = useColorScheme() ?? 'light'

  const { data, isLoading, error } = useQuery({
    queryKey: reactQueryKeyStore.defaults(String(id)),
    queryFn: async () => await getDefaultsById(id),
  })

  if (isLoading || error || !data) {
    return null
  }

  const colorMap = {
    blue: Colors[theme].primaryBackground,
    orange: Colors[theme].secondaryBackground,
    green: Colors[theme].successBackground,
    red: Colors[theme].dangerBackground,
  }

  const textColors = {
    blue: Colors[theme].primaryElevated,
    orange: Colors[theme].secondaryElevated,
    green: Colors[theme].successElevated,
    red: Colors[theme].dangerElevated,
  }

  return (
    <AnimatedPressable
      style={[
        animatedStyle,
        {
          borderRadius: 8,
          backgroundColor: colorMap[data.color],
          width: 150,
          height: 150,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
      onPress={() => {
        setTopTaskSelectionScreenIndex(0)
        router.push(`/shortcut/${id}`)
      }}
      onPressIn={() => {
        impactAsync(ImpactFeedbackStyle.Light)
        scale.set(withTiming(0.95))
      }}
      onPressOut={() => {
        scale.set(withTiming(1))
      }}
    >
      <Text style={{ color: textColors[data.color], fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
        {convertDurationToText(data.duration) + (data.overUnder === 'Over' ? ' +' : '')}
      </Text>
    </AnimatedPressable>
  )
}
