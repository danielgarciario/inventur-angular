import { Action, createReducer, on } from '@ngrx/store';
import { initialLoginState } from './login.state';
import * as fromLogin from './login.actions';

// import { EffectsFeatureModule } from '@ngrx/effects/src/effects_feature_module';
// import { AppEstado } from '../root-store.state';
import { LoginState } from './login.state';
import { EstadoInicialApp } from '../root-store.state';

const loginreducer = createReducer(
  initialLoginState,
  on(fromLogin.Trytoken, (estado) => {
    estado = { ...estado };
    estado.isLoading = true;
    estado.authenticated = false;
    estado.user = null;
    return estado;
  }),
  on(fromLogin.Trylogin, (estado) => {
    estado = { ...estado };
    estado.isLoading = true;
    estado.authenticated = false;
    estado.user = null;
    return estado;
  }),
  on(fromLogin.Loginsuccess, (estado, { usuario }) => {
    estado = { ...estado };
    estado.isLoading = false;
    estado.authenticated = true;
    estado.user = usuario;
    return estado;
  }),
  on(fromLogin.Loginfail, (estado) => {
    estado = { ...estado };
    estado.isLoading = false;
    estado.authenticated = false;
    return estado;
  }),
  on(fromLogin.TokenTryFailed, (estado) => {
    estado = { ...estado };
    estado.isLoading = false;
    estado.authenticated = false;
    estado.user = null;
    return estado;
  }),
  on(fromLogin.LoginUnbekannt, (estado) => {
    estado = { ...estado };
    estado.isLoading = false;
    estado.authenticated = false;
    estado.user = null;
    return estado;
  }),
  on(fromLogin.Logout, (estado) => {
    estado = { ...estado };
    estado.isLoading = false;
    estado.authenticated = false;
    estado.user = null;
    return estado;
  })
);

export function reducerlogin(state: LoginState | undefined, action: Action) {
  return loginreducer(state, action);
}
