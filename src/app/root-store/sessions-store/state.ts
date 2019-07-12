import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Sesion } from '../../models/sesion.model';
import { SesionPos } from 'src/app/models/sespos.model';

export interface Estado {
  sesiones: SessionsState;
  posiciones: SessionPosState;
}

export const selectEstadoSesiones = (estado: Estado) => estado.sesiones;
export const selectEstadoPosiciones = (estado: Estado) => estado.posiciones;

interface SessionsState extends EntityState<Sesion> {
  loadingSessions: boolean;
  addDialogShow: boolean;
  deleteDialogShow: boolean;
  selectedSesionId?: number;
}

interface SessionPosState extends EntityState<SesionPos> {
  loadingPositions: boolean;
  addDialogShow: boolean;
  deleteDialogShow: boolean;
}

export function getSessionId(s: Sesion): number {
  return s.idSesion;
}
export function ordenaPorFechas(a: Sesion, b: Sesion): number {
  return a.started > b.started ? 1 : -1;
}

export function getSessionPosicionId(sp: SesionPos): number {
  return sp.idsespos;
}
export function ordenaPorFechasSesionPosicion(
  a: SesionPos,
  b: SesionPos
): number {
  return a.checkedam > b.checkedam ? 1 : -1;
}

export const sesionadapter: EntityAdapter<Sesion> = createEntityAdapter<Sesion>(
  {
    selectId: getSessionId,
    sortComparer: ordenaPorFechas
  }
);
export const posicionsadapter: EntityAdapter<SesionPos> = createEntityAdapter<
  SesionPos
>({
  selectId: getSessionPosicionId,
  sortComparer: ordenaPorFechasSesionPosicion
});
const sesionInitialState: SessionsState = sesionadapter.getInitialState({
  loadingSessions: false,
  addDialogShow: false,
  deleteDialogShow: false,
  selectedSesionId: null
});
const positionInitialState: SessionPosState = posicionsadapter.getInitialState({
  loadingPositions: false,
  addDialogShow: false,
  deleteDialogShow: false
});

export const initialState: Estado = {
  sesiones: sesionInitialState,
  posiciones: positionInitialState
};

export const {
  selectAll: getAllSessions,
  selectEntities: getSessionsEntities,
  selectIds: getSessionsIds,
  selectTotal: getSessionsTotal
} = sesionadapter.getSelectors();

export const {
  selectAll: getAllPositions,
  selectEntities: getPositionsEntities,
  selectIds: getPositionsIds,
  selectTotal: getPostionsTotal
} = posicionsadapter.getSelectors();
