import { Sesion } from '../../models/sesion.model';
import * as fromState from './state';
import * as fromSessionsState from './subestados/Sesions.state';
import * as fromPositionState from './subestados/SessionPos.state';
import * as fromKandidatoState from './subestados/Kandidatos.state';
import * as fromPotencialesState from './subestados/Potenciales.state';
import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';
// import { SesionPos } from 'src/app/models/sespos.model';
// import { Kandidato } from 'src/app/models/kandidato.model';
// import { Artikel } from 'src/app/models/artikel.model';
import { AppEstado } from '../root-store.state';

/* export const getSessionState = createFeatureSelector<fromState.Estado>(
  'sesion'
);
*/
export const getSessionState = (estado: AppEstado) => estado.session;

const isloadingSessions = (estado: fromState.EstadoSesiones) =>
  estado.sesiones.loadingSessions;
const getSelectedSessionId = (estado: fromState.EstadoSesiones) =>
  estado.sesiones.selectedSesionId;

export const getSessionEntityState = createSelector(
  getSessionState,
  (estado) => estado.sesiones
);
export const getPositionsEntityState = createSelector(
  getSessionState,
  (estado) => estado.posiciones
);
export const getKandidatosEntityState = createSelector(
  getSessionState,
  (estado) => estado.kandidatos
);
export const getPotencialesEntityState = createSelector(
  getSessionState,
  (estado) => estado.potenciales
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
export const isLoadingSessions = createSelector(
  getSessionEntityState,
  (s) => s.loadingSessions
);

export const isLoadingPositions = createSelector(
  getPositionsEntityState,
  (s) => s.loadingPositions
);

export const isLoadingKandidatos = createSelector(
  getKandidatosEntityState,
  (s) => s.loadingKandidatos
);

export const isLoadingPotenciales = createSelector(
  getPotencialesEntityState,
  (s) => s.loadingPotencials
);

export const DameSessionSelectedId = createSelector(
  getSessionEntityState,
  (s) => s.selectedSesionId
);

export const DameSesiones = createSelector(
  getSessionEntityState,
  fromSessionsState.getAllSessions
);

export const DamePosiciones = createSelector(
  getPositionsEntityState,
  fromPositionState.getAllPositions
);

export const DameKandidatos = createSelector(
  getKandidatosEntityState,
  fromKandidatoState.getAllKandidatos
);

export const DamePotenciales = createSelector(
  getPotencialesEntityState,
  fromPotencialesState.getAllPotencials
);

/*
export const DameSelectedSession = createSelector(
  fromState.getSessionsEntities,
  DameSessionSelectedId,
  (entidades, selectedId) => selectedId && entidades[selectedId]
);
*/

export const DameSelectedSession = createSelector(
  getSessionEntityState,
  DameSessionSelectedId,
  (entidades, selectedId) => selectedId && entidades.entities[selectedId]
);

export const DameSelectedPotencial = createSelector(
  getPotencialesEntityState,
  (s) => s.selectedPotencial
);

export function BorraMemoizs() {
  DamePosiciones.release();
  DameSessionSelectedId.release();
  DameSelectedSession.release();
  DameKandidatos.release();

  isLoadingPositions.release();
}
