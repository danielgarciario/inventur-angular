import { createAction, props } from '@ngrx/store';
import { Sesion } from '../../models/sesion.model';
import { SesionPos } from 'src/app/models/sespos.model';

export const LoadSesions = createAction('[Sesions] Loadsessions');

export const LoadSesionsSuccess = createAction(
  '[Sesions] Loadsessions success',
  props<{ nuevassesiones: Array<Sesion> }>()
);
export const SelectSesion = createAction(
  '[Sesions] Selected',
  props<{ selectedSesionId: number }>()
);
export const LoadPositions = createAction('[Sesions] Load SessionsPosition');

export const LoadPositionsSuccess = createAction(
  '[Sesions] Loadpostions success',
  props<{ posiciones: Array<SesionPos> }>()
);
