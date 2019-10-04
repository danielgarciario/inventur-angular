import { SesionStates } from './sesionstatesenum.enum';
import * as moment from 'moment';

export interface Sesion {
  idSesion: number;
  empno: string;
  started: moment.Moment;
  lager: LagerSesion;
  statusSesion: SesionStates;
  // statusSesion: number;
  comment: string;
  numPosiciones: number;
  posicionesContadas: number;
}

export interface LagerSesion {
  cwar: string;
  lager: string;
  mitlagerplatz: boolean;
}
