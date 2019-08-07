import * as fsesions from './sessions-store/subestados/Sesions.state';
import * as fposiciones from './sessions-store/subestados/SessionPos.state';
import * as fkandidatos from './sessions-store/subestados/Kandidatos.state';
import * as fpotenciales from './sessions-store/subestados/Potenciales.state';
import * as flogin from './login-store/login.state';
import { reducerSessions } from './sessions-store/reducer';
import { reducerlogin } from './login-store/login.reducer';

import { ActionReducerMap } from '@ngrx/store';
// import { RouterReducerState } from '@ngrx/router-store';
// import { Params } from '@angular/router';
import { LoginState, initialLoginState } from './login-store/login.state';
import { EstadoSesiones, sesionInitialState } from './sessions-store/state';

export interface AppEstado {
  login: LoginState;
  session: EstadoSesiones;
}

export const EstadoInicialApp: AppEstado = {
  login: initialLoginState,
  session: sesionInitialState
};

export const rootreducermap: ActionReducerMap<AppEstado> = {
  login: reducerlogin,
  session: reducerSessions
};
