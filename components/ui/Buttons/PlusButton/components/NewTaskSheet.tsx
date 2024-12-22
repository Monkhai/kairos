import DurationPicker from '@/components/ui/DurationPicker/DurationPicker'
import InputField from '@/components/ui/inputs/InputField'
import { queryClient } from '@/providers/QueryProvider'
import reactQueryKeyStore from '@/queries/reactQueryKeyStore'
import { createTask } from '@/server/tasks/queries'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { Keyboard, Pressable, useColorScheme } from 'react-native'
import Button from '../../TextButton'

interface Props {
  bottomSheetRef: React.RefObject<BottomSheet>
}
export default function NewTaskSheet({ bottomSheetRef }: Props) {
  const theme = useColorScheme() ?? 'light'
  const [taskName, setTaskName] = React.useState('')
  const [taskDescription, setTaskDescription] = React.useState('')
  const [hours, setHours] = React.useState(0)
  const [minutes, setMinutes] = React.useState(0)
  const { mutate: createTaskMutation, isPending } = useMutation({
    mutationFn: async ({ description, duration, title }: { title: string; description: string; duration: number }) =>
      await createTask(title, description, duration),
    onSuccess: () => {
      const queryKey = reactQueryKeyStore.tasks()
      queryClient.invalidateQueries({ queryKey })
      Keyboard.dismiss()
    },

    onError: error => {
      console.error(error)
    },
  })

  const handleCreateTask = () => {
    createTaskMutation({ description: taskDescription, duration: hours * 60 + minutes, title: taskName })
  }

  const duration = hours * 60 + minutes

  const disabled = taskName.length === 0 || taskDescription.length === 0 || duration === 0

  return (
    <BottomSheetView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <Pressable onPress={() => Keyboard.dismiss()} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '80%' }}>
        <>
          <InputField value={taskName} onChangeText={setTaskName} />
          <InputField value={taskDescription} onChangeText={setTaskDescription} />

          <DurationPicker hours={hours} minutes={minutes} setHours={setHours} setMinutes={setMinutes} />
          <Button disabled={disabled} isLoading={isPending} label="Add task" onPress={handleCreateTask} />
        </>
      </Pressable>
    </BottomSheetView>
  )
}
