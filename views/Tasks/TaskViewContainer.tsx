import { View, Text } from 'react-native'
import React from 'react'
import TasksView from './TasksView'
import { useQuery } from '@tanstack/react-query'
import { getTasks } from '@/server/tasks/queries'
import LoaderScreen from '../LoaderScreen'
import reactQueryKeyStore from '@/queries/reactQueryKeyStore'

export default function TaskViewContainer() {
  const [contentOffset, setContentOffset] = React.useState(0)
  const [itemFocus, setItemFocus] = React.useState(false)
  const { data, isLoading, error } = useQuery({
    queryKey: reactQueryKeyStore.tasks(),
    queryFn: async () => getTasks(),
  })

  if (isLoading) {
    return <LoaderScreen />
  }

  if (error || !data) {
    //TODO implement error screen
    return null
  }

  return (
    <TasksView
      tasks={data}
      contentOffset={contentOffset}
      setContentOffset={setContentOffset}
      itemFocus={itemFocus}
      setItemFocus={setItemFocus}
    />
  )
}
