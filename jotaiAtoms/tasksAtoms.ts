import { atom } from 'jotai'

export const taskSearchQueryAtom = atom<string>('')
export const topTaskSelectionScreenIndex = atom<number>(0)
export const hideDoneAtom = atom<boolean>(true)
