import { TaskFilter } from '@/server/tasks/queryTypes'
import { atom } from 'jotai'

export const taskSearchQueryAtom = atom<string>('')
