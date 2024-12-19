import { MutableRefObject, ReactNode, Ref, RefObject, useState } from 'react'
import { View } from 'react-native'

export default function useElementDimensions() {
  const [w, setW] = useState(0)
  const [h, setH] = useState(0)

  const onMount = (element: View) => {
    element.measure((_, __, width, height) => {
      setW(width)
      setH(height)
    })
  }

  return { w, h, onMount }
}
