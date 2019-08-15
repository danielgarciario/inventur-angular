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
import { Dictionary } from '@ngrx/entity';
import { SesionPos } from 'src/app/models/sespos.model';

const elreducer = createReducer(
  sesionInitialState,
  on(fromActions.LoadSesions, (estado) => {
    let ssesiones = { ...estado.sesiones };
    ssesiones.loadingSessions = true;
    ssesiones.selectedSesionId = null;
    ssesiones = sesionadapter.removeAll(ssesiones);
    return { ...estado, sesiones: ssesiones };
  }),
  on(fromActions.SelectSesion, (estado, { selectedSesionId }) => {
    const ssesiones = { ...estado.sesiones };
    ssesiones.selectedSesionId = selectedSesionId;
    return { ...estado, sesiones: ssesiones };
  }),
  on(fromActions.LoadSesionsSuccess, (estado, { nuevassesiones }) => {
    let ssesiones = { ...estado.sesiones };
    ssesiones = sesionadapter.addMany(nuevassesiones, ssesiones);
    ssesiones.loadingSessions = false;
    ssesiones.selectedSesionId = null;
    return { ...estado, sesiones: ssesiones };
  }),
  on(fromActions.DeleteSesionSuccess, (estado, { sesionid }) => {
    let ssesiones = { ...estado.sesiones };
    ssesiones = sesionadapter.removeOne(sesionid, ssesiones);
    return { ...estado, sesiones: ssesiones };
  }),
  on(fromActions.LoadPositions, (estado) => {
    let sposiciones = { ...estado.posiciones };
    sposiciones.loadingPositions = true;
    sposiciones = posicionsadapter.removeAll(estado.posiciones);
    return { ...estado, posiciones: sposiciones };
  }),
  on(
    fromActions.DeleteSesionPosicionSuccess,
    (estado, { sesionid, posicionid }) => {
      let sposiciones = { ...estado.posiciones };
      sposiciones = posicionsadapter.removeOne(posicionid, sposiciones);
      return { ...estado, posiciones: sposiciones };
    }
  ),
  on(fromActions.SetSelectPosition, (estado, { posicion }) => {
    const sposiciones = { ...estado.posiciones };
    sposiciones.selectedSessionPos = posicion;
    return { ...estado, posiciones: sposiciones };
  }),
  on(fromActions.LoadPositionsSuccess, (estado, { nuevasposiciones }) => {
    let sposition = { ...estado.posiciones };
    sposition = posicionsadapter.addMany(nuevasposiciones, sposition);
    sposition.loadingPositions = false;
    return { ...estado, posiciones: sposition };
  }),
  on(fromActions.BuscaCandidatosLagerOrt, (estado, { localizacion }) => {
    let skandidatos = { ...estado.kandidatos };
    skandidatos = kandidatosadapter.removeAll(skandidatos);
    skandidatos.loadingKandidatos = true;
    return { ...estado, kandidatos: skandidatos };
  }),
  on(fromActions.CandidatosLagerOrtSuccess, (estado, { nuevosCandidatos }) => {
    let skandidatos = { ...estado.kandidatos };
    skandidatos = kandidatosadapter.addMany(nuevosCandidatos, skandidatos);
    skandidatos.loadingKandidatos = false;
    skandidatos.selectedKandidate = null;
    return { ...estado, kandidatos: skandidatos };
  }),
  on(fromActions.BuscaCandidatosItem, (estado, { item }) => {
    let skandidatos = { ...estado.kandidatos };
    skandidatos = kandidatosadapter.removeAll(skandidatos);
    skandidatos.loadingKandidatos = true;
    return { ...estado, kandidatos: skandidatos };
  }),
  on(fromActions.BuscaCandidatosItemSuccess, (estado, { nuevosCandidatos }) => {
    let skandidatos = { ...estado.kandidatos };
    skandidatos = kandidatosadapter.addMany(nuevosCandidatos, skandidatos);
    skandidatos.loadingKandidatos = false;
    skandidatos.selectedKandidate = null;
    return { ...estado, kandidatos: skandidatos };
  }),
  on(fromActions.buscaArticulos, (estado, { busqueda }) => {
    let spotenciales = { ...estado.potenciales };
    spotenciales = potencialadapter.removeAll(spotenciales);
    spotenciales.loadingPotencials = true;
    spotenciales.selectedPotencial = null;
    return { ...estado, potenciales: spotenciales };
  }),
  on(fromActions.buscaArticulosSucess, (estado, { nuevospotenciales }) => {
    let spotenciales = { ...estado.potenciales };
    spotenciales = potencialadapter.addMany(nuevospotenciales, spotenciales);
    spotenciales.loadingPotencials = false;
    return { ...estado, potenciales: spotenciales };
  }),
  on(fromActions.seleccionaArticulo, (estado, { articuloseleccionado }) => {
    let spotenciales = { ...estado.potenciales };
    spotenciales = potencialadapter.addOne(articuloseleccionado, spotenciales);
    spotenciales.loadingPotencials = false;
    spotenciales.selectedPotencial = articuloseleccionado;
    return { ...estado, potenciales: spotenciales };
  }),
  on(fromActions.seleccionaCandidato, (estado, { selectKandidato }) => {
    const skandidatos = { ...estado.kandidatos };
    skandidatos.selectedKandidate = selectKandidato;
    return { ...estado, kandidatos: skandidatos };
  }),
  on(fromActions.AddSesionPosSuccess, (estado, { nuevasespos }) => {
    let sposiciones = { ...estado.posiciones };
    sposiciones = posicionsadapter.addOne(nuevasespos, sposiciones);
    sposiciones.selectedSessionPos = nuevasespos;
    sposiciones.createdSuccess = true;
    return { ...estado, posiciones: sposiciones };
  }),
  on(fromActions.AddSesionPosSuccessAcknowledge, (estado) => {
    const sposiciones = { ...estado.posiciones };
    sposiciones.createdSuccess = false;
    return { ...estado, posiciones: sposiciones };
  }),
  on(fromActions.TryAddSerialBestandToGezahltSuccess, (estado, { sespos }) => {
    let sposiciones = { ...estado.posiciones };
    sposiciones = posicionsadapter.upsertOne(sespos, sposiciones);
    sposiciones.modificada = true;
    return { ...estado, posiciones: sposiciones };
  }),
  on(fromActions.TryAddSerialBestandToGezahltFailed, (estado) => {
    return estado;
  }),
  on(fromActions.TryResetGezhaltIDSucess, (estado, { sespos }) => {
    let sposiciones = { ...estado.posiciones };
    sposiciones = posicionsadapter.upsertOne(sespos, sposiciones);
    sposiciones.modificada = true;
    return { ...estado, posiciones: sposiciones };
  }),
  on(fromActions.ChangePosGzehalDetailIDSuccess, (estado, { sespos }) => {
    let sposiciones = { ...estado.posiciones };
    sposiciones = posicionsadapter.upsertOne(sespos, sposiciones);
    sposiciones.modificada = true;
    return { ...estado, posiciones: sposiciones };
  }),
  on(fromActions.DeleteGezhaltIDSuccess, (estado, { posicion }) => {
    let sposiciones = { ...estado.posiciones };
    sposiciones = posicionsadapter.upsertOne(posicion, sposiciones);
    return { ...estado, posiciones: sposiciones };
  }),
  on(fromActions.TrySaveGezhaltID, (estado, { posicion }) => {
    const sposiciones = { ...estado.posiciones };
    sposiciones.saving = true;
    return { ...estado, posiciones: sposiciones };
  }),
  on(fromActions.SaveGezhaltIDSucess, (estado, { posicion }) => {
    let sposiciones = { ...estado.posiciones };
    sposiciones = posicionsadapter.upsertOne(posicion, sposiciones);
    sposiciones.modificada = false;
    sposiciones.saving = false;
    sposiciones.selectedSessionPos = posicion;
    return { ...estado, posiciones: sposiciones };
  }),
  on(fromActions.SaveGezhaltIDFailed, (estado) => {
    const sposiciones = { ...estado.posiciones };
    sposiciones.saving = false;
    return { ...estado, posiciones: sposiciones };
  })
);

export function reducerSessions(
  state: EstadoSesiones | undefined,
  action: Action
) {
  return elreducer(state, action);
}
