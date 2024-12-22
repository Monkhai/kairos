import { db } from '@/server/tasks/setupDB'
import { TaskFilter, TaskOrdering } from '@/server/tasks/queryTypes'
import { TaskType } from '@/server/tasks/taskTypes'
import { generateUUID } from './helpers'

class TaskError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'TaskError'
  }
}

export async function getTasks(filters: Array<TaskFilter> = [], orderings: Array<TaskOrdering> = []): Promise<Array<TaskType>> {
  const filterRow = filters.map(filter => filter.filterString()).join(' AND ')
  const orderRow = orderings.length > 0 ? orderings.map(order => order.orderString()).join(', ') : 'updated_at ASC'

  const array: Array<TaskType> = await db.getAllAsync(
    `SELECT id, title, description, duration FROM tasks ${
      filterRow != '' ? 'WHERE done = FALSE AND ' + filterRow : ''
    } ORDER BY ${orderRow}`
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
async function getTask(id: string): Promise<[TaskType | null, null | Error]> {
  try {
    const task: Array<TaskType> = await db.getAllAsync(`SELECT id, title, description, duration FROM tasks WHERE id = ?`, [id])
    return [task[0], null]
  } catch (error) {
    if (error instanceof Error) {
      return [null, new TaskError(error.message, 'getTask')]
    }
    return [null, new Error('Unrecognized error')]
  }
}

async function updateTask(
  id: string,
  newTitle: string | null = null,
  newDescription: string | null = null,
  newDuration: number | null = null
): Promise<null | Error> {
  const texts = [
    newTitle == null ? '' : `title = ${newTitle}`,
    newDescription == null ? '' : `description = ${newDescription}`,
    newDuration == null ? '' : `duration = ${newDuration}`,
  ].filter(text => text.length > 0)

  if (texts.length == 0) {
    return null
  }

  try {
    await db.runAsync(`UPDATE tasks WHERE id = ? SET ${texts.join(', ')}`, [id])
    return null
  } catch (error) {
    if (error instanceof Error) {
      return new TaskError(error.message, 'updateTask')
    }
    return new Error('Unrecognized error')
  }
}

async function markTaskAsDone(id: string): Promise<null | Error> {
  try {
    await db.runAsync(`UPDATE tasks WHERE id = ${id} SET done = TRUE`)
    return null
  } catch (error) {
    if (error instanceof Error) {
      return new TaskError(error.message, 'markTaskAsDone')
    }
    return new Error('Unrecognized error')
  }
}

async function deleteTask(id: string): Promise<void | Error> {
  try {
    await db.runAsync(`DELETE FROM tasks WHERE id = ?`, [id])
  } catch (error) {
    if (error instanceof Error) {
      return new TaskError(error.message, 'deleteTask')
    }
    return new Error('Unrecognized error')
  }
}
