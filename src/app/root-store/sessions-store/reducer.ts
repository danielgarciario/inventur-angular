import { Action, createReducer, on } from '@ngrx/store';
import { Estado, sesionadapter, initialState } from './state';
import { Sesion } from '../../models/sesion.model';
import * as fromActions from './actions';

const elreducer = createReducer(
  initialState,
  on(fromActions.LoadSesions, (estado) => {
    estado = { ...estado };
    estado.sesiones.loadingSessions = true;
    return estado;
  }),
  on(fromActions.SelectSesion, (estado, { selectedSesionId }) => {
    console.log(`Reducer Selected Sesion con ID ${selectedSesionId}`);
    estado = { ...estado };
    estado.sesiones.selectedSesionId = selectedSesionId;
    return estado;
  }),
  /*  on(fromActions.LoadSesionsSuccess, (estado, { nuevassesiones }) => {
    console.log(`Reducer Sesiones.Cargadas`);
    console.log(nuevassesiones);
    const estadosesions = { ...estado.sesiones };
    estadosesions.loadingSessions = false;
    estado = { ...estado, sesiones: estadosesions };
    return sesionadapter.addAll(nuevassesiones, estado);
  }) */
  on(fromActions.LoadSesionsSuccess, (estado, { nuevassesiones }) => {
    estado = {
      ...estado,
      sesiones: sesionadapter.addMany(nuevassesiones, estado.sesiones)
    };
    estado.sesiones.loadingSessions = false;
    return estado;
  })
);

export function reducer(state: Estado | undefined, action: Action) {
  return elreducer(state, action);
}
