import { Sesion } from '../../models/sesion.model';
import * as fromState from './state';
import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';

export const getSessionState = createFeatureSelector<fromState.Estado>(
  'sesion'
);

const isloadingSessions = (estado: fromState.Estado) =>
  estado.sesiones.loadingSessions;
const getSelectedSessionId = (estado: fromState.Estado) =>
  estado.sesiones.selectedSesionId;

export const getSessionEntityState = createSelector(
  getSessionState,
  (estado) => estado.sesiones
);

/*
export const isLoadingSessions: MemoizedSelector<
  fromState.Estado,
  boolean
> = createSelector(
  getSessionState,
  loading
);
*/
export const isLoadingSessions: MemoizedSelector<
  fromState.Estado,
  boolean
> = createSelector(
  getSessionEntityState,
  (s) => s.loadingSessions
);
export const DameSessionSelectedId: MemoizedSelector<
  fromState.Estado,
  number
> = createSelector(
  getSessionEntityState,
  (s) => s.selectedSesionId
);

export const DameSesiones: MemoizedSelector<
  fromState.Estado,
  Array<Sesion>
> = createSelector(
  getSessionEntityState,
  fromState.getAllSessions
);
/*
export const DameSelectedSession = createSelector(
  fromState.getSessionsEntities,
  DameSessionSelectedId,
  (entidades, selectedId) => selectedId && entidades[selectedId]
);
*/

export const DameSelectedSession: MemoizedSelector<
  fromState.Estado,
  Sesion
> = createSelector(
  getSessionEntityState,
  DameSessionSelectedId,
  (entidades, selectedId) => selectedId && entidades[selectedId]
);
