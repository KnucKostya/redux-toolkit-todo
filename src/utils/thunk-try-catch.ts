import {handleServerNetworkError} from "utils/error-utils";
import {appActions} from "app/app-reducer";

/**
 * Executes a Redux Toolkit thunk action creator with try-catch error handling and sets the app status to 'loading' during the execution of the thunk.
 *
 * @param {Object} thunkApi - The Redux Toolkit `thunkAPI` object with `dispatch`, `getState`, and `extra` properties.
 * @param {Function} logic - The function that represents the main logic of the thunk action creator, to be executed inside a try block.
 * @returns {Promise<*>} - A Promise that resolves with the return value of `logic`, or rejects with a `rejectedWithValue` action if an error occurs.
 */

export const thunkTryCatch = async (thunkApi:any,logic:()=>{}) => {
    const{dispatch, rejectWithValue} = thunkApi
    try{
        dispatch(appActions.setAppStatus({status: 'loading'}))
        return logic()
    }
    catch (e){
        handleServerNetworkError(e,dispatch)
        return rejectWithValue(null)
    }
    finally {
        dispatch(appActions.setAppStatus({status: 'idle'}))
    }
}