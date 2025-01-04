export default {
  // tasks
  tasks: (filters: { searchQuery?: string; showDone?: boolean }) => ['tasks', filters],
  oneTask: (id: string) => ['tasks', id],

  // defaults
  defaults: (id: string) => ['defaults', id],
}
