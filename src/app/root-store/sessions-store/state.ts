import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Sesion } from '../../models/sesion.model';

export interface Estado extends EntityState<Sesion> {
  addDialogShow: boolean;
  loading: boolean;
  selectedSesionId: number;
}

export function getSessionId(s: Sesion): number {
  return s.idSesion;
}
export function ordenaPorFechas(a: Sesion, b: Sesion): number {
  return a.started > b.started ? 1 : -1;
}

export const adapter: EntityAdapter<Sesion> = createEntityAdapter<Sesion>({
  selectId: getSessionId,
  sortComparer: ordenaPorFechas
});

export const initialState: Estado = adapter.getInitialState({
  addDialogShow: false,
  loading: false,
  selectedSesionId: null
});
