import TickBoxButton from '@/components/ui/Buttons/TickBoxButton'
import Screen from '@/components/ui/Screen'
import React from 'react'

export default function Page() {
  return (
    <Screen>
      <Screen.Header></Screen.Header>
      <Screen.Body>
        <TickBoxButton />
      </Screen.Body>
      <Screen.Footer></Screen.Footer>
    </Screen>
  )
}
