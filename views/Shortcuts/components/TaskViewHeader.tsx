import BackButton from '@/components/ui/Buttons/BackButton'
import { cardColorMap, CardColorMapKey, Colors } from '@/constants/Colors'
import { Text, useColorScheme, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const TASK_VIEW_HEADER_HEIGHT = 98

interface Props {
  onBack: () => void
  color: CardColorMapKey
  title: string
}
export function TaskViewHeader({ onBack, title, color = 'blue' }: Props) {
  const insets = useSafeAreaInsets()
  const theme = useColorScheme() ?? 'light'

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
        ellipsizeMode="tail"
        numberOfLines={1}
        style={{
          maxWidth: '85%',
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
