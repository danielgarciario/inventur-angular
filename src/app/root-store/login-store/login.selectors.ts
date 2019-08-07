import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';
import { User } from '../../models/user.model';
import { LoginState } from './login.state';
import { AppEstado } from '../root-store.state';
// import { LoginStoreState } from '.';
/*
export const loginState = createFeatureSelector<LoginState>('login');

// export const loginState = createSelector<LoginState>('login');

export const loginIsLoading: MemoizedSelector<
  LoginState,
  boolean
> = createSelector(
  loginState,
  (estado: LoginState): boolean => estado.isLoading
);

export const loginIsAuthenticated: MemoizedSelector<
  LoginState,
  boolean
> = createSelector(
  loginState,
  (estado: LoginState): boolean => estado.authenticated
);

export const loginIsLoaded: MemoizedSelector<
  LoginState,
  boolean
> = createSelector(
  loginState,
  (estado: LoginState): boolean => estado.loaded
);

export const loginUsuario: MemoizedSelector<LoginState, User> = createSelector(
  loginState,
  (estado: LoginState): User => estado.user
);

export const istLogidIn = (estado: LoginState) => estado.authenticated;

 */
export const selectLogin = (estado: AppEstado) => estado.login;

export const loginIsLoadind = createSelector(
  selectLogin,
  (estado: LoginState) => estado.isLoading
);
export const loginIsAuthenticated = createSelector(
  selectLogin,
  (estado: LoginState) => estado.authenticated
);
export const loginIsLoaded = createSelector(
  selectLogin,
  (estado: LoginState) => estado.loaded
);
export const loginUsuario: MemoizedSelector<AppEstado, User> = createSelector(
  selectLogin,
  (estado: LoginState) => estado.user
);
