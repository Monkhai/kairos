import DurationPicker from '@/components/ui/DurationPicker/DurationPicker'
import InputField from '@/components/ui/inputs/InputField'
import { InputRef } from '@/components/ui/inputs/InputText'
import { queryClient } from '@/providers/QueryProvider'
import reactQueryKeyStore from '@/queries/reactQueryKeyStore'
import { createTask } from '@/server/tasks/queries'
import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import React, { useCallback, useRef } from 'react'
import { Keyboard, StyleSheet, View } from 'react-native'
import Button from '../../TextButton'

export default function NewTaskSheet() {
  const [taskName, setTaskName] = React.useState('')
  const [taskDescription, setTaskDescription] = React.useState('')
  const [hours, setHours] = React.useState(0)
  const [minutes, setMinutes] = React.useState(0)
  const [durationPickerKey, setDurationPickerKey] = React.useState(false)

  const nameRef = useRef<InputRef>(null)
  const descriptionRef = useRef<InputRef>(null)

  const duration = React.useMemo(() => hours * 60 + minutes, [hours, minutes])
  const disabled = React.useMemo(() => taskName?.length === 0 || !taskName || duration === 0, [taskName, duration])

  const { mutate: createTaskMutation, isPending } = useMutation({
    mutationFn: async ({ description, duration, title }: { title: string; description: string; duration: number }) =>
      await createTask(title, description, duration),
    onSuccess: () => {
      const queryKey = reactQueryKeyStore.tasks()
      queryClient.refetchQueries({ queryKey, exact: false })
      resetForm()
    },
    onError: error => {
      console.error(error)
    },
  })

  const resetForm = useCallback(() => {
    setTaskName('')
    setTaskDescription('')
    nameRef.current?.reset()
    descriptionRef.current?.reset()
    setHours(0)
    setMinutes(0)
    Keyboard.dismiss()
    router.back()
    setDurationPickerKey(prev => !prev)
  }, [])

  const handleCreateTask = () => {
    createTaskMutation({ description: taskDescription, duration: hours * 60 + minutes, title: taskName })
  }

  return (
    <View style={styles.topContainer}>
      <View
        style={styles.container}
        onTouchStart={e => {
          if (e.target === e.currentTarget) {
            Keyboard.dismiss()
          }
        }}
      >
        <View style={styles.body}>
          <View style={styles.content}>
            <View style={styles.inputContainer}>
              <InputField ref={nameRef} placeholder="name" value={taskName} onChangeText={setTaskName} />
              <InputField ref={descriptionRef} placeholder="description" value={taskDescription} onChangeText={setTaskDescription} />
            </View>
            <DurationPicker resetKey={durationPickerKey} hours={hours} minutes={minutes} setHours={setHours} setMinutes={setMinutes} />
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Button disabled={disabled} isLoading={isPending} label="Add task" onPress={handleCreateTask} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    paddingTop: 24,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  body: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    width: '80%',
    gap: 24,
  },
  inputContainer: {
    gap: 16,
    width: '100%',
  },
  footer: {
    width: '50%',
    flex: 1,
    justifyContent: 'flex-end',
  },
})
