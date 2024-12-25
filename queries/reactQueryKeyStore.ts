import { TaskFilter } from '@/server/tasks/queryTypes'

export default {
  tasks: (searchQuery?: string) => ['tasks', { searchQuery }],
}
