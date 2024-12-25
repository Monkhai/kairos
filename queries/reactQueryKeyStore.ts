import { TaskFilter } from '@/server/tasks/queryTypes'

export default {
  tasks: (filters?: Array<TaskFilter>) => ['tasks', { filters }],
}
