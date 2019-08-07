import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Sesion } from '../../../models/sesion.model';

export interface SessionsState extends EntityState<Sesion> {
  loadingSessions: boolean;
  addDialogShow: boolean;
  deleteDialogShow: boolean;
  selectedSesionId?: number;
}

function getSessionId(s: Sesion): number {
  return s.idSesion;
}
function ordenaPorFechas(a: Sesion, b: Sesion): number {
  return a.started < b.started ? 1 : -1;
}

export const sesionadapter: EntityAdapter<Sesion> = createEntityAdapter<Sesion>(
  {
    selectId: getSessionId,
    sortComparer: ordenaPorFechas
  }
);

export const sesionInitialState: SessionsState = sesionadapter.getInitialState({
  loadingSessions: false,
  addDialogShow: false,
  deleteDialogShow: false,
  selectedSesionId: null
});

export const {
  selectAll: getAllSessions,
  selectEntities: getSessionsEntities,
  selectIds: getSessionsIds,
  selectTotal: getSessionsTotal
} = sesionadapter.getSelectors();
