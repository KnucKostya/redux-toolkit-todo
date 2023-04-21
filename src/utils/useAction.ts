import { ActionCreator, ActionCreatorsMapObject, AsyncThunk, bindActionCreators, } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { useAppDispatch } from 'hooks/useAppDispatch';

/**
 * A custom React hook that returns an object with bound Redux Toolkit action creators, wrapped with `bindActionCreators`, and with special handling for async thunks.
 *
 * @template Actions - The type of the action creators object, extending `ActionCreatorsMapObject`.
 * @param {Actions} actions - The object with the action creators to bind to the Redux store dispatch function.
 * @returns {BoundActions<Actions>} - An object with the bound action creators, ready to be used as props in React components.
 *
 * @example
 * const { increment, decrement } = useActions(counterActions);
 * increment();
 * decrement();
 */

export const useActions = <Actions extends ActionCreatorsMapObject = ActionCreatorsMapObject>
(actions: Actions): BoundActions<Actions> => {
    const dispatch = useAppDispatch();

    return useMemo(() => bindActionCreators(actions, dispatch), []);
};

// Types
type BoundActions<Actions extends ActionCreatorsMapObject> = {
    [key in keyof Actions]: Actions[key] extends AsyncThunk<any, any, any>
        ? BoundAsyncThunk<Actions[key]>
        : Actions[key];
};

type BoundAsyncThunk<Action extends ActionCreator<any>> = (
    ...args: Parameters<Action>
) => ReturnType<ReturnType<Action>>;
