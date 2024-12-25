import { Colors } from '@/constants/Colors'
import { TaskType } from '@/server/tasks/taskTypes'
import { Canvas, FontStyle, Paragraph, Path, Skia, TextAlign } from '@shopify/react-native-skia'
import React, { useEffect, useState } from 'react'
import { View, Text, useColorScheme } from 'react-native'
import { useSharedValue, withDelay, withTiming } from 'react-native-reanimated'

const circleLinesNumber = 24
const inRadius = 75
const outRadius = 100

interface Props {
  task: TaskType | undefined
  textColor: string
}

export default function ActiveTask({ task, textColor }: Props) {
  if (!task) {
    return <></>
  }

  const theme = useColorScheme() ?? 'light'
  const [progress, setProgress] = useState(task.duration * 60)
  const [done, setDone] = useState(false)
  const paths = Array.from({ length: circleLinesNumber }).map((_, i) => {
    const radians = (i * 2 * Math.PI) / circleLinesNumber - Math.PI / 2
    let startX = inRadius * Math.cos(radians) + 104
    let endX = outRadius * Math.cos(radians) + 104
    let startY = inRadius * Math.sin(radians) + 104
    let endY = outRadius * Math.sin(radians) + 104
    const path = Skia.Path.Make().moveTo(startX, startY).lineTo(endX, endY)
    return path
  })
  const opacities = Array.from({ length: circleLinesNumber }).map(() => useSharedValue(1))

  const paragprah = Skia.ParagraphBuilder.Make({
    textStyle: {
      fontSize: 22,
      fontStyle: FontStyle.Bold,
      color: Skia.Color(textColor),
    },
    textAlign: TextAlign.Center,
  })
    .addText(getDurationString(progress))
    .build()

  useEffect(() => {
    let mutableProgress = progress
    const i = setInterval(() => {
      if (mutableProgress <= 0) {
        setProgress(task.duration * 60)
        opacities.forEach((opacity) => {
          opacity.value = withTiming(1)
        })
        clearInterval(i)
        setDone(true)
        return
      }
      setProgress(--mutableProgress)
    }, 1000)

    const durationInMilli = task.duration * 60 * 1000
    const durationPerLine = durationInMilli / circleLinesNumber
    opacities.reverse().forEach((opacity, i) => {
      opacity.value = withDelay(i * durationPerLine, withTiming(0.5, { duration: durationPerLine }))
    })

    return () => {
      clearInterval(i)
    }
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
      <Canvas style={{ width: 208, height: 208 }}>
        {paths.map((path, i) => {
          return <Path opacity={opacities[i]} key={i} path={path} style='stroke' strokeCap={'round'} strokeWidth={5} color={textColor} />
        })}
        <Paragraph paragraph={paragprah} width={100} x={208 / 2 - 50} y={104 - 10} />
      </Canvas>
      <Text style={{ color: textColor, fontSize: 30, fontWeight: '500', padding: 5, textAlign: 'center' }}>{task.description}</Text>
    </View>
  )
}

/**
 * Converts a duration in seconds to a formatted string.
 *
 * @param duration - The duration in seconds.
 * @returns A formatted string representing the duration.
 */
function getDurationString(duration: number): string {
  const hours = Math.floor(duration / 3600) < 10 ? `0${Math.floor(duration / 3600)}` : Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60) < 10 ? `0${Math.floor((duration % 3600) / 60)}` : Math.floor((duration % 3600) / 60)
  const seconds = duration % 60 < 10 ? `0${duration % 60}` : duration % 60
  return `${hours}:${minutes}:${seconds}`
}
