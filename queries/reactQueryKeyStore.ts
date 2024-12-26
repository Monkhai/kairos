import id from '@/app/shortcut/[id]'
import { TaskFilter } from '@/server/tasks/queryTypes'

export default {
  tasks: (searchQuery?: string) => ['tasks', { searchQuery }],
  oneTask: (id: string) => ['tasks', id],

  // defaults
  defaults: (id: string) => ['defaults', id],
}
