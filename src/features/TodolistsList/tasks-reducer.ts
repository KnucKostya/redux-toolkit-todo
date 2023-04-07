import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from 'api/todolists-api'
import {AppThunk} from 'app/store'
import {handleServerAppError, handleServerNetworkError} from 'utils/error-utils'
import {appActions} from 'app/app-reducer';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todolistsActions} from "features/TodolistsList/todolists-reducer";
import {createAppAsyncThunk} from "utils/create-app-async-thunk";

const fetchTasks = createAppAsyncThunk<{tasks:TaskType[],todolistId:string},string>('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    const {dispatch,rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const res = await todolistsAPI.getTasks(todolistId)
        const tasks = res.data.items
        // dispatch(tasksActions.setTasks({tasks, todolistId})) вместо это теперь пишу ретурн
        //и то что ретурнится с санки , присваивает себе тип tasks/fetchTasks/fullfield с payloadom того что возвращается
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
        return {todolistId, tasks}
    }
  catch (e){
        handleServerNetworkError(e,dispatch)
        return rejectWithValue(null)
  }
})

const addTask = createAppAsyncThunk<{task:TaskType},{title: string, todolistId: string}>('tasks/addTask',async(arg, thunkAPI)=>{
    const {dispatch,rejectWithValue} = thunkAPI

    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const res = await todolistsAPI.createTask(arg.todolistId, arg.title)
        if (res.data.resultCode === 0) {
            const task = res.data.data.item
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {task}
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    }
    catch (e){
        handleServerNetworkError(e,dispatch)
        return rejectWithValue(null)
    }
})

const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        removeTask: (state, action: PayloadAction<{ taskId: string, todolistId: string }>) => {
            state[action.payload.todolistId] = state[action.payload.todolistId].filter(t => t.id != action.payload.taskId)
        },
        // addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
        //     state[action.payload.task.todoListId].unshift(action.payload.task)
        // },
        updateTask: (state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) => {
            state[action.payload.todolistId] = state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {...t, ...action.payload.model} : t)
        },
        // setTasks: (state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) => {
        //     state[action.payload.todolistId] = action.payload.tasks
        // },
        setTodos: (state, action: PayloadAction<{ id: string }>) => {
            state[action.payload.id] = []
        },
        clearTodoState: (state, action: PayloadAction<{ id: string }>) => {
            state[action.payload.id] = []
        },
        logOutTaskReducer: (state) => {
            state = {}
        }
    },
    extraReducers: builder => {
        builder
            .addCase(tasksThunks.fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })//это вместо setTasks
            .addCase(tasksThunks.addTask.fulfilled,(state, action)=>{
                state[action.payload.task.todoListId].unshift(action.payload.task)
            })//это вместо addTasks
            .addCase(todolistsActions.addTodolist, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistsActions.removeTodolist, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(todolistsActions.setTodolists, (state, action) => {
                action.payload.todolists.forEach(td => {
                    state[td.id] = []
                })
            })
    }
})

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = {fetchTasks,addTask}

// thunks

// export const addTaskTC = (title: string, todolistId: string): AppThunk => (dispatch) => {
//     dispatch(appActions.setAppStatus({status: 'loading'}))
//     todolistsAPI.createTask(todolistId, title)
//         .then(res => {
//             if (res.data.resultCode === 0) {
//                 const task = res.data.data.item
//                 const action = tasksActions.addTask({task})
//                 dispatch(action)
//                 dispatch(appActions.setAppStatus({status: 'succeeded'}))
//             } else {
//                 handleServerAppError(res.data, dispatch);
//             }
//         })
//         .catch((error) => {
//             handleServerNetworkError(error, dispatch)
//         })
// }

export const removeTaskTC = (taskId: string, todolistId: string): AppThunk => (dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(() => {
            const action = tasksActions.removeTask({taskId, todolistId})
            dispatch(action)
        })
}

export const updateTaskTC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
    (dispatch, getState) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...model
        }

        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = tasksActions.updateTask({taskId, model, todolistId})
                    dispatch(action)
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch);
            })
    }

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
