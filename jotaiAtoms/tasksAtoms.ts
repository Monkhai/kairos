import { TaskFilter } from '@/server/tasks/queryTypes'
import { atom } from 'jotai'

export const taskSearchQueryAtom = atom<string>('')
export const topTaskSelectionScreenIndex = atom<number>(0)
