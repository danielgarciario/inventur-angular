import { Action, createReducer, on } from '@ngrx/store';
import { LoginState, initialState } from './login.state';
import * as fromLogin from './login.actions';

import { EffectsFeatureModule } from '@ngrx/effects/src/effects_feature_module';

const loginreducer = createReducer(
  initialState,
  on(fromLogin.Trylogin, (estado) => ({
    ...estado,
    isLoading: true,
    loaded: false,
    error: null
  })),
  on(fromLogin.Loginsuccess, (estado, { usuario }) => ({
    ...estado,
    isLoading: false,
    loaded: true,
    authenticated: true,
    error: null,
    user: usuario
  })),
  on(fromLogin.Loginfail, (estado, { error }) => ({
    ...estado,
    isLoading: false,
    loaded: false,
    authenticated: false,
    error
  })),
  on(fromLogin.TokenTryFailed, (estado) => ({
    ...estado,
    isLoading: false,
    loaded: false,
    authenticated: false,
    error: null
  })),
  on(fromLogin.LoginfromTokensuccess, (estado, { usuario }) => ({
    ...estado,
    isLoading: false,
    loaded: true,
    authenticated: true,
    error: null,
    user: usuario
  })),
  on(fromLogin.Logout, (estado) => ({
    ...estado,
    isLoading: false,
    authenticated: false,
    loaded: false,
    error: null,
    user: null
  }))
);

export function reducerlogin(state: LoginState | undefined, action: Action) {
  return loginreducer(state, action);
}
