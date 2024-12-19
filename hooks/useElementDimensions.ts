import { MutableRefObject, ReactNode, Ref, RefObject, useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'

export default function useElementDimensions() {
  const [w, setW] = useState(0)
  const [h, setH] = useState(0)

  const onMount = (e: LayoutChangeEvent) => {
    setW(e.nativeEvent.layout.width)
    setH(e.nativeEvent.layout.height)
  }

  return { w, h, onMount }
}
