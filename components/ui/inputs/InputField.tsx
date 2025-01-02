import { Colors } from '@/constants/Colors'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { useColorScheme, View } from 'react-native'
import InputText, { InputRef } from './InputText'
import Subtitle from '../Text/Subtitle'

interface Props {
  value: string
  onChangeText: (text: string) => void
  inBottomSheet?: boolean
  label?: string
  placeholder?: string
}
export default forwardRef<InputRef, Props>(function InputField(
  { onChangeText, value, label, placeholder, inBottomSheet = true }: Props,
  ref
) {
  const inputRef = useRef<InputRef>(null)
  const theme = useColorScheme() ?? 'light'

  useImperativeHandle(ref, () => ({
    reset: () => {
      inputRef.current?.reset()
    },
  }))

  return (
    <View style={{ width: '100%', gap: 8 }}>
      <View style={{ marginLeft: 8 }}>{label ? <Subtitle label={label} /> : null}</View>
      <View
        style={{
          backgroundColor: Colors[theme].background,
          padding: 20,
          borderRadius: 8,
          width: '100%',
        }}
      >
        <InputText
          ref={inputRef}
          inBottomSheet={inBottomSheet}
          type="large"
          placeholder={placeholder}
          value={value}
          editable
          onChangeText={onChangeText}
        />
      </View>
    </View>
  )
})
