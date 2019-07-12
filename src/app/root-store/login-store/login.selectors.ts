import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';
import { User } from '../../models/user.model';
import { LoginState } from './login.state';

export const loginState = createFeatureSelector<LoginState>('login');

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
