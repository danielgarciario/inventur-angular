import { createAction, props } from '@ngrx/store';
import { Sesion } from '../../models/sesion.model';

export const LoadSesions = createAction('[Sesions] Loadsessions');

export const LoadSesionsSuccess = createAction(
  '[Sesions] Loadsessions success',
  props<{ sesiones: Array<Sesion> }>()
);
export const SelectSesion = createAction(
  '[Sesions] Selected',
  props<{ selectedSesionId: number }>()
);
