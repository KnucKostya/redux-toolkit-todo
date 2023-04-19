import { ResponseType } from 'api/todolists-api'
import { Dispatch } from 'redux'
import { appActions } from 'app/app-reducer';
import axios, {AxiosError} from "axios";

/**
 * handleServerAppError обработка ошибки приложения
 * @param data респонс дата от сервака
 * @param dispatch
 * @param showError необязательный параметр для отображение ошибки
 */

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch, showError:boolean = true) => {
	if (data.messages.length) {
		dispatch(appActions.setAppError({error: data.messages[0]}))
	} else {
		dispatch(appActions.setAppError({error: 'Some error occurred'}))
	}
	dispatch(appActions.setAppStatus({status: 'failed'}))
}

/**
 * handleServerNetworkError обработка ошибки соединения с интернетом
 * @param e ошибка
 * @param dispatch
 */

export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
	const err = e as Error | AxiosError<{ error: string }>
	if (axios.isAxiosError(err)) {
		const error = err.message ? err.message : 'Some error occurred'
		dispatch(appActions.setAppError({error}))
	} else {
		dispatch(appActions.setAppError({error: `Native error ${err.message}`}))
	}
	dispatch(appActions.setAppStatus({status: 'failed'}))
}