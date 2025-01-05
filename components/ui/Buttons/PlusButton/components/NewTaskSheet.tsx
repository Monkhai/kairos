import CustomBottomSheet from '@/components/ui/BottomSheet'
import DurationPicker from '@/components/ui/DurationPicker/DurationPicker'
import InputField from '@/components/ui/inputs/InputField'
import { InputRef } from '@/components/ui/inputs/InputText'
import Title from '@/components/ui/Text/Title'
import { queryClient } from '@/providers/QueryProvider'
import reactQueryKeyStore from '@/queries/reactQueryKeyStore'
import { createTask } from '@/server/tasks/queries'
import BottomSheet, { BottomSheetView, WINDOW_HEIGHT } from '@gorhom/bottom-sheet'
import { useMutation } from '@tanstack/react-query'
import React, { useCallback, useRef } from 'react'
import { Keyboard, Platform, StyleSheet, View } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import Button from '../../TextButton'
import useKeyboardState from '@/hooks/useKeyboardState'

interface Props {
  bottomSheetRef: React.RefObject<BottomSheet>
}
export default function NewTaskSheet({ bottomSheetRef }: Props) {
  const [taskName, setTaskName] = React.useState('')
  const [taskDescription, setTaskDescription] = React.useState('')
  const [hours, setHours] = React.useState(0)
  const [minutes, setMinutes] = React.useState(0)
  const isKeyboardVisible = useKeyboardState()

  const nameRef = useRef<InputRef>(null)
  const descriptionRef = useRef<InputRef>(null)

  const duration = React.useMemo(() => hours * 60 + minutes, [hours, minutes])
  const disabled = React.useMemo(
    () => taskName?.length === 0 || taskDescription?.length === 0 || duration === 0,
    [taskName, taskDescription, duration]
  )
  const snapPoint = React.useMemo(() => (WINDOW_HEIGHT < 700 && Platform.OS === 'android' ? '80%' : '60%'), [])

  const { mutate: createTaskMutation, isPending } = useMutation({
    mutationFn: async ({ description, duration, title }: { title: string; description: string; duration: number }) =>
      await createTask(title, description, duration),
    onSuccess: () => {
      const queryKey = reactQueryKeyStore.tasks()
      queryClient.refetchQueries({ queryKey, exact: false })
      bottomSheetRef.current?.close()
    },
    onError: error => {
      console.error(error)
    },
  })

  const handleSheetClose = useCallback(() => {
    setTaskName('')
    setTaskDescription('')
    nameRef.current?.reset()
    descriptionRef.current?.reset()
    setHours(0)
    setMinutes(0)
    Keyboard.dismiss()
  }, [])

  const handleCreateTask = () => {
    createTaskMutation({ description: taskDescription, duration: hours * 60 + minutes, title: taskName })
  }

  return (
    <CustomBottomSheet onClose={handleSheetClose} bottomInset={-0.5} bottomSheetRef={bottomSheetRef} snapPoints={[snapPoint]}>
      <BottomSheetView style={styles.bottomSheetContainer}>
        <View style={styles.container}>
          <TouchableWithoutFeedback style={styles.touchable} onPress={Keyboard.dismiss}>
            <View style={styles.body}>
              <Title label={'New Task'} />
              <View style={styles.content}>
                <View style={styles.inputContainer}>
                  <InputField ref={nameRef} placeholder="name" value={taskName} onChangeText={setTaskName} />
                  <InputField ref={descriptionRef} placeholder="description" value={taskDescription} onChangeText={setTaskDescription} />
                </View>
                <DurationPicker hours={hours} minutes={minutes} setHours={setHours} setMinutes={setMinutes} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
        {isKeyboardVisible ? null : (
          <View style={styles.footer}>
            <Button disabled={disabled} isLoading={isPending} label="Add task" onPress={handleCreateTask} />
          </View>
        )}
      </BottomSheetView>
    </CustomBottomSheet>
  )
}

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  bottomSheetContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  body: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  inputContainer: {
    gap: 16,
    width: '100%',
  },
  footer: {
    paddingBottom: 64,
    width: '50%',
  },
})
