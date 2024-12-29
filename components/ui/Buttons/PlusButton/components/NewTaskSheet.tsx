import CustomBottomSheet from '@/components/ui/BottomSheet'
import DurationPicker from '@/components/ui/DurationPicker/DurationPicker'
import InputField from '@/components/ui/inputs/InputField'
import { InputRef } from '@/components/ui/inputs/InputText'
import Title from '@/components/ui/Text/Title'
import { taskSearchQueryAtom } from '@/jotaiAtoms/tasksAtoms'
import { queryClient } from '@/providers/QueryProvider'
import reactQueryKeyStore from '@/queries/reactQueryKeyStore'
import { createTask } from '@/server/tasks/queries'
import BottomSheet, { BottomSheetView, WINDOW_HEIGHT } from '@gorhom/bottom-sheet'
import { useMutation } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import React, { useRef } from 'react'
import { Keyboard, Platform, Pressable, View } from 'react-native'
import Button from '../../TextButton'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

interface Props {
  bottomSheetRef: React.RefObject<BottomSheet>
}
export default function NewTaskSheet({ bottomSheetRef }: Props) {
  const [taskName, setTaskName] = React.useState('')
  const [taskDescription, setTaskDescription] = React.useState('')
  const [hours, setHours] = React.useState(0)
  const [minutes, setMinutes] = React.useState(0)
  const [searchQuery] = useAtom(taskSearchQueryAtom)
  const nameRef = useRef<InputRef>(null)
  const descriptionRef = useRef<InputRef>(null)

  function handleSheetClose() {
    setTaskName('')
    setTaskDescription('')
    nameRef.current?.reset()
    descriptionRef.current?.reset()
    setHours(0)
    setMinutes(0)
    Keyboard.dismiss()
  }

  const { mutate: createTaskMutation, isPending } = useMutation({
    mutationFn: async ({ description, duration, title }: { title: string; description: string; duration: number }) =>
      await createTask(title, description, duration),
    onSuccess: () => {
      const queryKey = reactQueryKeyStore.tasks(searchQuery)
      queryClient.refetchQueries({ queryKey })
      bottomSheetRef.current?.close()
    },
    onError: error => {
      console.error(error)
    },
  })

  const handleCreateTask = () => {
    createTaskMutation({ description: taskDescription, duration: hours * 60 + minutes, title: taskName })
  }

  const duration = hours * 60 + minutes
  const disabled = taskName?.length === 0 || taskDescription?.length === 0 || duration === 0

  const snapPoint = WINDOW_HEIGHT < 700 && Platform.OS === 'android' ? '80%' : '60%'

  return (
    <CustomBottomSheet onClose={handleSheetClose} bottomInset={-0.5} bottomSheetRef={bottomSheetRef} snapPoints={[snapPoint]}>
      <BottomSheetView style={{ width: '100%', flex: 1, alignItems: 'center' }}>
        <View style={{ flex: 1, width: '100%' }}>
          <TouchableWithoutFeedback
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
            }}
            onPress={Keyboard.dismiss}
          >
            <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
              <Title label={'New Task'} />
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '80%' }}>
                <View style={{ gap: 16, width: '100%' }}>
                  <InputField ref={nameRef} placeholder="name" value={taskName} onChangeText={setTaskName} />
                  <InputField ref={descriptionRef} placeholder="description" value={taskDescription} onChangeText={setTaskDescription} />
                </View>
                <DurationPicker inModal hours={hours} minutes={minutes} setHours={setHours} setMinutes={setMinutes} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={{ paddingBottom: 64, width: '50%' }}>
          <Button disabled={disabled} isLoading={isPending} label="Add task" onPress={handleCreateTask} />
        </View>
      </BottomSheetView>
    </CustomBottomSheet>
  )
}
