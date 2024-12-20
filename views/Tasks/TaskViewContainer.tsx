import { View, Text } from 'react-native'
import React from 'react'
import TasksView from './TasksView'

export default function TaskViewContainer() {
  const [contentOffset, setContentOffset] = React.useState(0)
  const [itemFocus, setItemFocus] = React.useState(false)
  return <TasksView contentOffset={contentOffset} setContentOffset={setContentOffset} itemFocus={itemFocus} setItemFocus={setItemFocus} />
}
