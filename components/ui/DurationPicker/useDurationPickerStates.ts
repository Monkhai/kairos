import { useState } from 'react'

export default function useDurationPickerStates(defaultDuration?: number) {
  const [hours, setHours] = useState(getCurrentHour(defaultDuration))
  const [minutes, setMinutes] = useState(getCurrentMinute(defaultDuration))
  return { hours, setHours, minutes, setMinutes }
}

function getCurrentHour(defaultDuration?: number) {
  if (defaultDuration) {
    const h = Math.floor(defaultDuration / 60)
    return h
  }
  return new Date().getHours()
}
function getCurrentMinute(defaultDuration?: number) {
  if (defaultDuration) {
    const m = defaultDuration % 60
    return m
  }
  return new Date().getMinutes()
}
