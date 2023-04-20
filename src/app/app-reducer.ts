import {Dispatch} from 'redux'
import {authAPI} from 'api/todolists-api'
import {authActions} from 'features/Login/auth-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {createAppAsyncThunk} from "utils/create-app-async-thunk";
import {handleServerNetworkError} from "utils/error-utils";
import {thunkTryCatch} from "utils/thunk-try-catch";


const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

export type AppInitialStateType = typeof initialState
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initializeApp = createAppAsyncThunk<void, void>
('app/initialize', async(arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI

    try {
        let res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(authActions.setIsLoggedIn({isLoggedIn: true})) ;
        }
    }catch (e){
        handleServerNetworkError(e,dispatch)
        return rejectWithValue(null)
    }finally {
        dispatch(appActions.setAppInitialized({isInitialized: true}));
    }

})

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized
        },
    },
})

export const appReducer = slice.reducer
export const appActions = slice.actions
export const appThunks = {initializeApp}




