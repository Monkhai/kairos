import BackButton from '@/components/ui/Buttons/BackButton'
import NewTaskSheet from '@/components/ui/Buttons/PlusButton/components/NewTaskSheet'
import Screen from '@/components/ui/Screen'
import Title from '@/components/ui/Text/Title'
import { Colors } from '@/constants/Colors'
import { router } from 'expo-router'
import React from 'react'
import { Platform, useColorScheme, View } from 'react-native'

export default function NewTaskView() {
  const colorScheme = useColorScheme() ?? 'light'
  return (
    <Screen noHeader>
      <Screen.Header>
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: Platform.OS === 'ios' ? 0 : 16,
            flex: 1,
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flex: 1 }}>
            <BackButton
              buttonColor={Colors[colorScheme].primaryButton}
              backgroundColor={Colors[colorScheme].primaryButton}
              onBack={() => {
                router.back()
              }}
              widthFraction={0.04}
              heightFraction={0.03}
            />
          </View>

          <View style={{ flex: 10, alignItems: 'center' }}>
            <Title label={'Create a new task'} />
          </View>
          <View style={{ flex: 1 }} />
        </View>
      </Screen.Header>
      <Screen.Body>
        <NewTaskSheet />
      </Screen.Body>
    </Screen>
  )
}
