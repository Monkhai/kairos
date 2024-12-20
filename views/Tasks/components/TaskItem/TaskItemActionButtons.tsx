import Button from "@/components/ui/Buttons/TextButton"
import React from "react"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

interface Props {
  onDelete: () => void
}
export default function TaskItemActionButtons({ onDelete }: Props) {
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut.duration(20)}
      style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "flex-end", flex: 1 }}
    >
      <Button type="dangerButton" size="sm" label="Delete" onPress={onDelete} />
      <Button type="primaryButton" size="sm" label="Start" onPress={() => {}} />
    </Animated.View>
  )
}
