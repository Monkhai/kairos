import { db } from '@/server/setupDB'
import { TaskFilter, TaskOrdering } from '@/server/tasks/queryTypes'
import { TaskType } from '@/server/tasks/taskTypes'
import { generateUUID } from './helpers'

class TaskError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'TaskError'
  }
}

export async function getTasks(
  searchQuery: string = '',
  filters: Array<TaskFilter> = [],
  orderings: Array<TaskOrdering> = [],
  onlyDone: boolean = true
): Promise<Array<TaskType>> {
  if (onlyDone) {
    filters.push(new TaskFilter('done', '=', '0'))
  }

  const searchQueryRow = searchQuery === '' ? '' : `WHERE (title LIKE '%${searchQuery}%' OR description LIKE '%${searchQuery}%')`
  const filterRow = filters.length === 0 ? '' : `WHERE (${filters.map((filter) => `${filter.filterString()}`).join(' AND ')})`
  const conditionRow = [searchQueryRow, filterRow].filter((row) => row !== '').join(' AND ')

  const orderRow = orderings.length > 0 ? orderings.map((order) => order.orderString()).join(', ') : 'updated_at ASC'

  const array: Array<TaskType> = await db.getAllAsync(
    `SELECT id, title, description, duration FROM tasks ${conditionRow} ORDER BY ${orderRow}`
  )
  return array
}

export async function createTask(title: string, description: string, duration: number): Promise<null | Error> {
  let attempts = 10
  let done: boolean | Error = false

  while (!done && attempts--) {
    done = await createTaskLogic(title, description, duration)
    if (done instanceof Error) {
      return done
    }
  }
  return null
}

async function createTaskLogic(title: string, description: string, duration: number): Promise<boolean | Error> {
  try {
    const id = generateUUID()
    await db.runAsync(`INSERT INTO tasks (id, title, description, duration) VALUES (?, ?, ?, ?)`, [id, title, description, duration])
    return true
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('UNIQUE constraint failed: tasks.id')) {
        return false
      } else {
        return new TaskError(error.message, 'createTask')
      }
    }
    return new Error('Unrecognized error')
  }
}

//TODO Figure out what we do on duplicate IDs
export async function getTask(id: string): Promise<TaskType> {
  const task: Array<TaskType> = await db.getAllAsync(`SELECT id, title, description, duration FROM tasks WHERE id = ?`, [id])
  return task[0]
}

export async function updateTask(id: string, newTitle: string, newDescription: string, newDuration: number): Promise<null | Error> {
  const texts = [`title = '${newTitle}'`, `description = '${newDescription}'`, `duration = ${newDuration}`]

  try {
    await db.runAsync(`UPDATE tasks SET ${texts.join(', ')} WHERE id = ?`, [id])
    return null
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      return new TaskError(error.message, 'updateTask')
    }
    return new Error('Unrecognized error')
  }
}

export async function markTaskAsDone(id: string): Promise<null | Error> {
  try {
    await db.runAsync(`UPDATE tasks SET done = TRUE WHERE id = ?`, [id])
    return null
  } catch (error) {
    if (error instanceof Error) {
      return new TaskError(error.message, 'markTaskAsDone')
    }
    return new Error('Unrecognized error')
  }
}

export async function deleteTask(id: string): Promise<void | Error> {
  try {
    await db.runAsync(`DELETE FROM tasks WHERE id = ?`, [id])
  } catch (error) {
    if (error instanceof Error) {
      return new TaskError(error.message, 'deleteTask')
    }
    return new Error('Unrecognized error')
  }
}
