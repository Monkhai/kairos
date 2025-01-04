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
  paused: boolean
}

export default function ActiveTask({ task, textColor, paused }: Props) {
  if (!task) {
    // TODO: handle error
    return <></>
  }

  const [isFinished, setIsFinished] = useState(false)
  const [progress, setProgress] = useState(task.duration * 60)
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

  const timerParagraph = Skia.ParagraphBuilder.Make({
    textStyle: {
      fontSize: 22,
      fontStyle: FontStyle.Bold,
      color: Skia.Color(textColor),
    },
    textAlign: TextAlign.Center,
  })
    .addText(getDurationString(progress))
    .build()

  const finishedParagraph = Skia.ParagraphBuilder.Make({
    textStyle: {
      fontSize: 30,
      fontStyle: FontStyle.Bold,
      color: Skia.Color(textColor),
    },
    textAlign: TextAlign.Center,
  })
    .addText('Finished')
    .build()

  useEffect(() => {
    let mutableProgress = progress
    const i = setInterval(() => {
      if (paused) return
      if (mutableProgress <= 0) {
        setProgress(task.duration * 60)
        opacities.forEach((opacity) => {
          opacity.value = withTiming(1)
        })
        clearInterval(i)
        setIsFinished(true)
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
  }, [paused])

  return (
    <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}>
      {isFinished ? (
        <Canvas style={{ width: 208, height: 208 }}>
          <Paragraph paragraph={finishedParagraph} width={208} x={0} y={104 - 10} />
        </Canvas>
      ) : (
        <Canvas style={{ width: 208, height: 208 }}>
          {paths.map((path, i) => {
            return <Path opacity={opacities[i]} key={i} path={path} style='stroke' strokeCap={'round'} strokeWidth={5} color={textColor} />
          })}
          <Paragraph paragraph={timerParagraph} width={100} x={208 / 2 - 50} y={104 - 10} />
        </Canvas>
      )}
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
