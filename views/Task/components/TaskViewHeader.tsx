import BackButton from '@/components/ui/Buttons/BackButton'
import { cardColorMap, Colors } from '@/constants/Colors'
import { getDefaultsById } from '@/server/userDefaults/queries'
import { convertDurationToText } from '@/views/Home/components/ShortcutCard/utils'
import { useHeaderHeight } from '@react-navigation/elements'
import { useQuery } from '@tanstack/react-query'
import { router, useGlobalSearchParams } from 'expo-router'
import { Text, useColorScheme, View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function TaskViewHeader() {
  const insets = useSafeAreaInsets()
  const { id } = useGlobalSearchParams<{ id: string }>()
  const theme = useColorScheme() ?? 'light'
  const { data, isLoading, error } = useQuery({
    queryKey: ['defaults', id],
    queryFn: async () => getDefaultsById(Number(id)),
  })
  const height = useHeaderHeight()
  console.log(height)

  return (
    <Animated.View
      entering={FadeIn}
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 32,
        backgroundColor: Colors[theme].background,
        paddingTop: insets.top,
      }}
    >
      <BackButton
        color={Colors[theme][cardColorMap[data?.color ?? 'blue'].text]}
        backFunction={() => router.back()}
        widthFraction={0.04}
        heightFraction={0.03}
      />
      <Text
        style={{
          textAlign: 'center',
          fontWeight: 700,
          color: Colors[theme][cardColorMap[data?.color ?? 'blue'].text],
          fontSize: 30,
        }}
      >
        {convertDurationToText(data?.duration ?? 0)}
      </Text>
      <View />
    </Animated.View>
  )
}
