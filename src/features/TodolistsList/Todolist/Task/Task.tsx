import React, {ChangeEvent, FC, useCallback, memo} from 'react'
import { Checkbox, IconButton } from '@mui/material'
import { EditableSpan } from 'components/EditableSpan/EditableSpan'
import { Delete } from '@mui/icons-material'
import {TaskStatuses, TaskType} from 'api/todolists-api'
import {tasksThunks} from "features/TodolistsList/tasks/tasks-reducer";
import {useActions} from "utils/useAction";

type Props = {
	task: TaskType
	todolistId: string
}


export const Task: FC<Props> = memo(({task,todolistId}) => {

	const {removeTask,updateTask} = useActions(tasksThunks)

	const removeTaskHandler = useCallback(() => removeTask({taskId:task.id, todolistId}), [task.id, props.todolistId]);

	const changeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		let newIsDoneValue = e.currentTarget.checked
		updateTask({taskId: task.id, model : newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New, todolistId})
	}, [task.id, todolistId]);

	const changeTaskTitle = useCallback((newValue: string) => {
		updateTask({taskId:task.id,model : newValue,todolistId: todolistId})
	}, [task.id,todolistId]);

	return <div key={task.id} className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
		<Checkbox
			checked={task.status === TaskStatuses.Completed}
			color="primary"
			onChange={changeTaskStatus}
		/>

		<EditableSpan value={task.title} onChange={changeTaskTitle}/>
		<IconButton onClick={removeTaskHandler}>
			<Delete/>
		</IconButton>
	</div>
})
