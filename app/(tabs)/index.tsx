import Button from '@/components/ui/Button/Button'
import Screen from '@/components/ui/Screen'
import React from 'react'

export default function Page() {
  return (
    <Screen>
      <Screen.Header></Screen.Header>
      <Screen.Body>
        <Button label="Test" varient="stroke" type="danger" />
      </Screen.Body>
      <Screen.Footer></Screen.Footer>
    </Screen>
  )
}
