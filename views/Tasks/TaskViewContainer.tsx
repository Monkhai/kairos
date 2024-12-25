import { taskFilterAtom } from '@/jotaiAtoms/tasksAtoms'
import reactQueryKeyStore from '@/queries/reactQueryKeyStore'
import { getTasks } from '@/server/tasks/queries'
import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import React from 'react'
import LoaderScreen from '../LoaderScreen'
import TasksView from './TasksView'

export default function TaskViewContainer() {
  const [contentOffset, setContentOffset] = React.useState(0)
  const [itemFocus, setItemFocus] = React.useState(false)
  const [filters] = useAtom(taskFilterAtom)
  const { data, isLoading, error } = useQuery({
    queryKey: reactQueryKeyStore.tasks(filters),
    queryFn: async () => await getTasks(filters),
  })

  if (isLoading) {
    return <LoaderScreen />
  }

  if (error || !data) {
    console.error(error)
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
