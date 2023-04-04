import {AppRootStateType} from "app/store";

export const selectError = (state:AppRootStateType) => state.app.error;
export const selectTodolists = (state:AppRootStateType) => state.todolists;
export const selectTasks = (state:AppRootStateType) => state.tasks;
export const selectIsLoggedIn = (state:AppRootStateType) => state.auth.isLoggedIn;
export const selectStatus = (state:AppRootStateType) => state.app.status;
export const selectIsInitialized = (state:AppRootStateType) => state.app.isInitialized;
