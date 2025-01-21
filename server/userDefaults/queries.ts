import { db } from '../setupDB'
import { Default } from './defaultsTypes'

export async function getDefaultsById(id: number): Promise<Default> {
  try {
    const userDefault: Array<Default> = await db.getAllAsync(`SELECT id, color, duration, overUnder FROM defaults WHERE id = ?`, [id])
    if (userDefault.length === 0) {
      throw new Error('Failed to get user default')
    }
    return userDefault[0]
  } catch (error) {
    throw new Error('Failed to get user defaults')
  }
}

export async function updateUserDefault(id: 1 | 2 | 3 | 4, duration: number): Promise<null> {
  try {
    await db.runAsync(`UPDATE defaults SET duration = ? WHERE id = ?`, [duration, id])
    return null
  } catch (error) {
    if (error instanceof Error) {
      throw Error('Failed to update user default')
    }
    throw Error('Unrecognized error')
  }
}
