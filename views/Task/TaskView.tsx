import { router, useLocalSearchParams } from 'expo-router'
import ActiveTaskView from './ActiveTaskView'

export default function TaskView() {
  const { task_id } = useLocalSearchParams<{ task_id: string }>()
  return <ActiveTaskView task_id={task_id} color={'purple'} />
}
