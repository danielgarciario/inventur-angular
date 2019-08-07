import * as fsesions from './subestados/Sesions.state';
import * as fposiciones from './subestados/SessionPos.state';
import * as fkandidatos from './subestados/Kandidatos.state';
import * as fpotenciales from './subestados/Potenciales.state';

export interface EstadoSesiones {
  sesiones: fsesions.SessionsState;
  posiciones: fposiciones.SessionPosState;
  kandidatos: fkandidatos.KandidatosState;
  potenciales: fpotenciales.PotencialesState;
}

export const sesionInitialState: EstadoSesiones = {
  sesiones: fsesions.sesionInitialState,
  posiciones: fposiciones.positionInitialState,
  kandidatos: fkandidatos.kandidatoInitialState,
  potenciales: fpotenciales.potencialInitialState
};
/*
export const selectEstadoSesiones = (estado: Estado) => estado.sesiones;
export const selectEstadoPosiciones = (estado: Estado) => estado.posiciones;
export const selectEstadoKandidatos = (estado: Estado) => estado.kandidatos;
export const selectPotencialesState = (estado: Estado) => estado.potenciales;


*/
