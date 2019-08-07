import { Action, createReducer, on } from '@ngrx/store';
import { initialLoginState } from './login.state';
import * as fromLogin from './login.actions';

// import { EffectsFeatureModule } from '@ngrx/effects/src/effects_feature_module';
// import { AppEstado } from '../root-store.state';
import { LoginState } from './login.state';

const loginreducer = createReducer(
  initialLoginState,
  on(fromLogin.Trylogin, (estado) => {
    estado = { ...estado };
    estado.isLoading = true;
    estado.loaded = false;
    estado.error = null;
    estado.authenticated = false;
    return estado;
  }),
  on(fromLogin.Loginsuccess, (estado, { usuario }) => {
    estado = { ...estado };
    estado.isLoading = false;
    estado.loaded = true;
    estado.authenticated = true;
    estado.error = null;
    estado.user = usuario;
    return estado;
  }),
  on(fromLogin.Loginfail, (estado, { error }) => {
    estado = { ...estado };
    estado.isLoading = false;
    estado.loaded = false;
    estado.authenticated = false;
    estado.error = error;
    return estado;
  }),
  on(fromLogin.TokenTryFailed, (estado, { error }) => {
    estado = { ...estado };
    estado.isLoading = false;
    estado.loaded = false;
    estado.authenticated = false;
    estado.error = error;
    return estado;
  }),
  on(fromLogin.LoginfromTokensuccess, (estado, { usuario }) => {
    estado = { ...estado };
    estado.isLoading = false;
    estado.loaded = true;
    estado.authenticated = true;
    estado.error = null;
    estado.user = usuario;
    return estado;
  }),
  on(fromLogin.Logout, (estado) => {
    estado = { ...estado };
    estado.isLoading = false;
    estado.loaded = false;
    estado.authenticated = false;
    estado.error = null;
    estado.user = null;
    return estado;
  }),
  on(fromLogin.NormalLoginFail, (estado) => {
    estado = { ...estado };
    estado.isLoading = false;
    estado.loaded = false;
    estado.authenticated = false;
    estado.error = null;
    estado.user = null;
    return estado;
  })
);

export function reducerlogin(state: LoginState | undefined, action: Action) {
  return loginreducer(state, action);
}
