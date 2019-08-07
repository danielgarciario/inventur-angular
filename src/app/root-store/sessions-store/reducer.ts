import { Action, createReducer, on } from '@ngrx/store';
// import { initialState } from './state';
// import { Sesion } from '../../models/sesion.model';
import * as fromActions from './actions';
import { potencialadapter } from './subestados/Potenciales.state';
import { sesionadapter } from './subestados/Sesions.state';
import { posicionsadapter } from './subestados/SessionPos.state';
import { kandidatosadapter } from './subestados/Kandidatos.state';
import { AppEstado, EstadoInicialApp } from '../root-store.state';
import { sesionInitialState } from './state';
import { EstadoSesiones } from './state';

const elreducer = createReducer(
  sesionInitialState,
  on(fromActions.LoadSesions, (estado) => {
    estado = { ...estado };
    estado.sesiones.loadingSessions = true;
    return estado;
  }),
  on(fromActions.SelectSesion, (estado, { selectedSesionId }) => {
    estado = { ...estado };
    estado.sesiones.selectedSesionId = selectedSesionId;
    return estado;
  }),
  on(fromActions.SelectSesion, (estado, { selectedSesionId }) => {
    estado = { ...estado };
    estado.sesiones.selectedSesionId = selectedSesionId;
    return estado;
  }),
  on(fromActions.LoadPositions, (estado) => {
    estado = { ...estado };
    estado.posiciones = posicionsadapter.removeAll(estado.posiciones);
    estado.posiciones.loadingPositions = true;
    return estado;
  }),
  on(fromActions.LoadSesionsSuccess, (estado, { nuevassesiones }) => {
    estado = { ...estado };
    estado.sesiones = sesionadapter.addMany(nuevassesiones, estado.sesiones);
    estado.sesiones.loadingSessions = false;
    return estado;
  }),
  on(fromActions.LoadPositionsSuccess, (estado, { nuevasposiciones }) => {
    estado = { ...estado };
    estado.posiciones = posicionsadapter.addMany(
      nuevasposiciones,
      estado.posiciones
    );
    estado.posiciones.loadingPositions = false;
    return estado;
  }),
  on(fromActions.BuscaCandidatosLagerOrt, (estado, { localizacion }) => {
    estado = { ...estado };
    estado.kandidatos = kandidatosadapter.removeAll(estado.kandidatos);
    estado.kandidatos.loadingKandidatos = true;
    return estado;
  }),
  on(fromActions.CandidatosLagerOrtSuccess, (estado, { nuevosCandidatos }) => {
    estado = { ...estado };
    estado.kandidatos = kandidatosadapter.addMany(
      nuevosCandidatos,
      estado.kandidatos
    );
    estado.kandidatos.loadingKandidatos = false;
    estado.kandidatos.selectedKandidate = null;
    return estado;
  }),
  on(fromActions.BuscaCandidatosItem, (estado, { item }) => {
    estado = { ...estado };
    estado.kandidatos = kandidatosadapter.removeAll(estado.kandidatos);
    estado.kandidatos.loadingKandidatos = true;
    return estado;
  }),
  on(fromActions.BuscaCandidatosItemSuccess, (estado, { nuevosCandidatos }) => {
    estado = { ...estado };
    estado.kandidatos = kandidatosadapter.addMany(
      nuevosCandidatos,
      estado.kandidatos
    );
    estado.kandidatos.loadingKandidatos = false;
    estado.kandidatos.selectedKandidate = null;
    return estado;
  }),
  on(fromActions.buscaArticulos, (estado, { busqueda }) => {
    estado = { ...estado };
    estado.potenciales = potencialadapter.removeAll(estado.potenciales);
    estado.potenciales.loadingPotencials = true;
    estado.potenciales.selectedPotencial = null;
    return estado;
  }),
  on(fromActions.buscaArticulosSucess, (estado, { nuevospotenciales }) => {
    estado = { ...estado };
    estado.potenciales = potencialadapter.addMany(
      nuevospotenciales,
      estado.potenciales
    );
    estado.potenciales.loadingPotencials = false;
    return estado;
  }),
  on(fromActions.seleccionaArticulo, (estado, { articuloseleccionado }) => {
    estado = { ...estado };
    estado.potenciales = potencialadapter.addOne(
      articuloseleccionado,
      estado.potenciales
    );
    estado.potenciales.loadingPotencials = false;
    estado.potenciales.selectedPotencial = articuloseleccionado;
    return estado;
  }),
  on(fromActions.seleccionaCandidato, (estado, { selectKandidato }) => {
    estado = { ...estado };
    estado.kandidatos.selectedKandidate = selectKandidato;
    return estado;
  }),
  on(fromActions.AddSesionPosSuccess, (estado, { nuevasespos }) => {
    estado = { ...estado };
    estado.posiciones = posicionsadapter.addOne(nuevasespos, estado.posiciones);
    estado.posiciones.selectedSessionPos = nuevasespos;
    return estado;
  })
);

export function reducerSessions(
  state: EstadoSesiones | undefined,
  action: Action
) {
  return elreducer(state, action);
}
