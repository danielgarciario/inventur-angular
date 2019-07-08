import { Action, createReducer, on } from '@ngrx/store';
import { Estado, adapter, initialState } from './state';
import { Sesion } from '../../models/sesion.model';
import * as fromActions from './actions';

const elreducer = createReducer(
  initialState,
  on(fromActions.LoadSesions, (estado) => ({ ...estado, loading: true })),
  on(fromActions.SelectSesion, (estado, { selectedSesionId }) => ({
    ...estado,
    selectedSesionId
  })),
  on(fromActions.LoadSesionsSuccess, (estado, { sesiones }) => {
    console.log(`Reducer Sesiones.Cargadas`);
    console.log(sesiones);
    estado = { ...estado, loading: false };
    return adapter.addAll(sesiones, estado);
  })
);

export function reducer(state: Estado | undefined, action: Action) {
  return elreducer(state, action);
}
