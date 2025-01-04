import { hideDoneAtom, taskSearchQueryAtom } from '@/jotaiAtoms/tasksAtoms'
import { queryClient } from '@/providers/QueryProvider'
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
  const [searchQuery] = useAtom(taskSearchQueryAtom)
  const [showDone] = useAtom(hideDoneAtom)
  const { data, isLoading, error } = useQuery({
    queryKey: reactQueryKeyStore.tasks({ searchQuery, showDone }),
    queryFn: async () => await getTasks(searchQuery, undefined, undefined, showDone),
    placeholderData: () => {
      return queryClient.getQueryData(reactQueryKeyStore.tasks({ searchQuery, showDone })) ?? []
    },
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
