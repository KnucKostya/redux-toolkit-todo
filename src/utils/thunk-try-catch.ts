import {handleServerNetworkError} from "utils/error-utils";
import {appActions} from "app/app-reducer";

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