import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AppRootStateType } from 'app/store'
import {
    FilterValuesType,
    TodolistDomainType, todolistsActions, todoListsThunks
} from './todolists-reducer'
import {TasksStateType, tasksThunks} from './tasks-reducer'
import { Grid, Paper } from '@mui/material'
import { AddItemForm } from 'components/AddItemForm/AddItemForm'
import { Todolist } from './Todolist/Todolist'
import { Navigate } from 'react-router-dom'
import { useAppDispatch } from 'hooks/useAppDispatch';
import {selectIsLoggedIn, selectTasks, selectTodolists} from "app/app-selectors";
import {TaskStatuses} from "api/todolists-api";

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(selectTodolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(selectTasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(selectIsLoggedIn)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
			dispatch(todoListsThunks.fetchTodoLists())
    }, [])

    const removeTask = useCallback(function (taskId: string, todolistId: string) {
        dispatch(tasksThunks.removeTask({taskId, todolistId}))
    }, [])

    const addTask = useCallback(function (title: string, todolistId: string) {
        const thunk = tasksThunks.addTask({title, todolistId})
        dispatch(thunk)
    }, [])

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        const thunk = tasksThunks.updateTask({taskId: id, model: {status}, todolistId})
        dispatch(thunk)
    }, [])

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        const thunk = tasksThunks.updateTask({taskId: id, model: {title: newTitle}, todolistId})
        dispatch(thunk)
    }, [])

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        const action = todolistsActions.changeTodolistFilter({id:todolistId, filter:value})
        dispatch(action)
    }, [])

    const removeTodolist = useCallback(function (todolistId: string) {
        const thunk = todoListsThunks.removeTodolist({todolistId})
        dispatch(thunk)
    }, [])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        const thunk = todoListsThunks.changeTodolistTitle({id, title})
        dispatch(thunk)
    }, [])

    const addTodolist = useCallback((title: string) => {
        const thunk =  todoListsThunks.addTodoList({title})
        dispatch(thunk)
    }, [dispatch])

    if (!isLoggedIn) {
        return <Navigate to={"/login"} />
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
