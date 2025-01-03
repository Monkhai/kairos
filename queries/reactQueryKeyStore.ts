import id from '@/app/shortcut/[id]'
import { TaskFilter } from '@/server/tasks/queryTypes'

export default {
  tasks: (filters: { searchQuery?: string; showDone?: boolean }) => ['tasks', filters],
  oneTask: (id: string) => ['tasks', id],

  // defaults
  defaults: (id: string) => ['defaults', id],
}
