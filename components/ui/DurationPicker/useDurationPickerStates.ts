import { useState } from 'react'

export default function useDurationPickerStates(defaultDuration?: number) {
  const [hours, setHours] = useState(getCurrentHour(defaultDuration))
  const [minutes, setMinutes] = useState(getCurrentMinute(defaultDuration))
  return { hours, setHours, minutes, setMinutes }
}

function getCurrentHour(defaultDuration?: number) {
  if (defaultDuration) {
    return Math.floor(defaultDuration / 60)
  }
  return new Date().getHours()
}

function getCurrentMinute(defaultDuration?: number) {
  if (defaultDuration) {
    return defaultDuration % 60
  }
  return new Date().getMinutes()
}
