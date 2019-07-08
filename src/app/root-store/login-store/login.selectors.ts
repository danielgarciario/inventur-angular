import { createFeatureSelector, createSelector } from '@ngrx/store';
import { User } from '../../models/user.model';
import { LoginState } from './login.state';

export const loginState = createFeatureSelector<LoginState>('login');

const currentUser = createSelector(
  loginState,
  (estado: LoginState): User => estado.user
);

export const loginIsLoading = createSelector(
  loginState,
  (estado: LoginState): boolean => estado.isLoading
);

export const loginIsAuthenticated = createSelector(
  loginState,
  (estado: LoginState): boolean => estado.authenticated
);

export const loginIsLoaded = createSelector(
  loginState,
  (estado: LoginState): boolean => estado.loaded
);

export const loginUsuario = createSelector(
  loginState,
  (estado: LoginState): User => estado.user
);
