import {
  createSelector,
  MemoizedSelector,
  createFeatureSelector
} from '@ngrx/store';
import { LoginStoreSelectors } from './login-store';
/*
import * as fromLogin from './login-store/login.selectors';
import * as fromSesion from './sessions-store/selectors';
import { Estado } from './root-store.state';
import { User } from '../models/user.model';

export const appState = createFeatureSelector<Estado>('app');

export const loginIsLoading: MemoizedSelector<Estado, boolean> = createSelector(
  appState,
  (estado: Estado) => estado.login.isLoading
);

export const loginIsAuthenticated: MemoizedSelector<
  Estado,
  boolean
> = createSelector(
  appState,
  (estado: Estado) => estado.login.authenticated
);

export const loginIsLoaded: MemoizedSelector<Estado, boolean> = createSelector(
  appState,
  (estado: Estado) => estado.login.loaded
);

export const loginUsuario: MemoizedSelector<Estado, User> = createSelector(
  appState,
  (estado: Estado) => estado.login.user
);
*/
