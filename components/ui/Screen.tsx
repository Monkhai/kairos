import { ThemedView } from '@/components/ThemedView'
import { useHeaderHeight } from '@react-navigation/elements'
import React, { ReactNode } from 'react'
import { Platform, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Props {
  children?: ReactNode
  withRouteHeader?: boolean
  noHeader?: boolean
  noPadding?: boolean
}

export default function Screen({ children, noHeader = false, withRouteHeader = false, noPadding = false }: Props) {
  const insets = useSafeAreaInsets()
  const headerHeight = useHeaderHeight()
  const paddingTop = noPadding ? 0 : noHeader ? headerHeight + insets.top / 2 : withRouteHeader ? headerHeight : insets.top
  return (
    <ThemedView
      style={{
        flex: 1,
        paddingTop,
        paddingBottom: noPadding ? 0 : Platform.select({ ios: insets.bottom, android: 40 }),
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
      }}
    >
      {children}
    </ThemedView>
  )
}

Screen.Header = Header
Screen.Body = Body
Screen.Footer = Footer

function Header({ children }: { children?: ReactNode }) {
  const { height: windowHeight } = useWindowDimensions()
  const height = Math.min(windowHeight * 0.1, 200)
  return (
    <View style={{ backgroundColor: 'transparent', width: '100%', minHeight: height, justifyContent: 'center', alignItems: 'center' }}>
      {children}
    </View>
  )
}

function Body({ children }: { children?: ReactNode }) {
  return (
    <View style={{ backgroundColor: 'transparent', width: '100%', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
      {children}
    </View>
  )
}
function Footer({ children }: { children?: ReactNode }) {
  const { height: windowHeight } = useWindowDimensions()
  const height = Math.min(windowHeight * 0.1, 200)
  return (
    <View style={{ backgroundColor: 'transparent', width: '100%', height, justifyContent: 'flex-end', alignItems: 'center' }}>
      {children}
    </View>
  )
}
