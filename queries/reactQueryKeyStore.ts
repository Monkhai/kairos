export default {
  // tasks
  tasks: (filters?: { searchQuery?: string; showDone?: boolean }) => (filters ? ['tasks', filters] : ['tasks']),
  oneTask: (id: string) => ['tasks', id],

  // defaults
  defaults: (id: string) => ['defaults', id],
}
