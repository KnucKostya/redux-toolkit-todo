import React, {useCallback, useEffect, memo, FC} from 'react'
import {AddItemForm} from 'components/AddItemForm/AddItemForm'
import {EditableSpan} from 'components/EditableSpan/EditableSpan'
import {Task} from '../tasks/Task/Task'
import {FilterValuesType, TodolistDomainType} from 'features/TodolistsList/Todolist/todolists-reducer'
import {Button, IconButton} from '@mui/material'
import {Delete} from '@mui/icons-material'
import {tasksThunks} from "features/TodolistsList/tasks/tasks-reducer";
import {useActions} from "utils/useAction";
import {TaskStatuses, TaskType} from "api/task-api";

type Props = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    demo?: boolean
}

export const Todolist:FC<Props> = memo(function ({demo = false, ...Props}: Props) {

    let {todolist,removeTodolist,changeTodolistTitle,changeFilter,addTask,tasks} = Props

    const {fetchTasks} = useActions(tasksThunks)


    useEffect(() => {
        if (demo) {
            return
        }
        fetchTasks(todolist.id)
    }, [])

    const addTaskFn = useCallback((title: string) => {
        addTask(title, todolist.id)
    }, [addTask, todolist.id])

    const removeTodolistFn = () => {
        removeTodolist(todolist.id)
    }
    const changeTodolistTitleFn = useCallback((title: string) => {
        changeTodolistTitle(todolist.id, title)
    }, [todolist.id, changeTodolistTitle])

    const onAllClickHandler = useCallback(() => changeFilter('all', todolist.id), [todolist.id, changeFilter])
    const onActiveClickHandler = useCallback(() => changeFilter('active', todolist.id), [todolist.id, changeFilter])
    const onCompletedClickHandler = useCallback(() => changeFilter('completed', todolist.id), [todolist.id, changeFilter])


    let tasksForTodolist = tasks

    if (todolist.filter === 'active') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (todolist.filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return <div>
        <h3><EditableSpan value={todolist.title} onChange={changeTodolistTitleFn}/>
            <IconButton onClick={removeTodolistFn} disabled={todolist.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTaskFn} disabled={todolist.entityStatus === 'loading'}/>
        <div>
            {
                tasksForTodolist?.map(t => <Task key={t.id} task={t} todolistId = {todolist.id}/>)
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            <Button variant={todolist.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={todolist.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={todolist.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
})


