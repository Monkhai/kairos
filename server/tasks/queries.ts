/* eslint-disable @typescript-eslint/array-type */
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
  onlyNotDone: boolean = true
): Promise<Array<TaskType>> {
  if (onlyNotDone) {
    filters.push(new TaskFilter('done', '=', '0'))
  }

  // Build conditions
  const conditions: string[] = []
  if (searchQuery !== '') {
    conditions.push(`(title LIKE '%${searchQuery}%' OR description LIKE '%${searchQuery}%')`)
  }
  if (filters.length > 0) {
    conditions.push(`${filters.map(filter => `${filter.filterString()}`).join(' AND ')}`)
  }

  // Combine conditions with a single WHERE
  const conditionRow = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  // Handle orderings
  const orderRow = orderings.length > 0 ? orderings.map(order => order.orderString()).join(', ') : 'updated_at ASC'

  // Execute query
  const array: Array<TaskType> = await db.getAllAsync(
    `SELECT id, title, description, duration, done FROM tasks ${conditionRow} ORDER BY ${orderRow}`
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
    await db.runAsync(`INSERT INTO tasks (id, title, description, duration, done) VALUES (?, ?, ?, ?, ?)`, [
      id,
      title,
      description,
      duration,
      false,
    ])
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

export async function updateTask(
  id: string,
  newTitle: string,
  newDescription: string,
  newDuration: number,
  done: boolean
): Promise<null | Error> {
  const texts = [`title = '${newTitle}'`, `description = '${newDescription}'`, `duration = ${newDuration}`, `done = ${done}`]

  try {
    await db.runAsync(`UPDATE tasks SET ${texts.join(', ')} WHERE id = ?`, [id])
    return null
  } catch (error) {
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
export async function markTaskAsNotDone(id: string): Promise<null | Error> {
  try {
    await db.runAsync(`UPDATE tasks SET done = FALSE WHERE id = ?`, [id])
    return null
  } catch (error) {
    if (error instanceof Error) {
      return new TaskError(error.message, 'markTaskAsNotDone')
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
