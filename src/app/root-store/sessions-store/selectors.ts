import { Sesion } from '../../models/sesion.model';
import * as fromState from './state';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const getSessionState = createFeatureSelector<fromState.Estado>(
  'sesion'
);

const isloading = (estado: fromState.Estado) => estado.loading;
const getSelectedSessionId = (estado: fromState.Estado) =>
  estado.selectedSesionId;

export const getSessionEntityState = createSelector(
  getSessionState,
  (estado) => estado
);

export const isLoadingSessions = createSelector(
  getSessionEntityState,
  isloading
);
export const DameSessionSelectedId = createSelector(
  getSessionEntityState,
  getSelectedSessionId
);
export const {
  selectAll: getAllSessions,
  selectEntities: getSessionsEntities,
  selectIds: getSessionsIds,
  selectTotal: getSessionsTotal
} = fromState.adapter.getSelectors();

export const DameSelectedSession = createSelector(
  getSessionsEntities,
  DameSessionSelectedId,
  (entidades, selectedId) => selectedId && entidades[selectedId]
);
