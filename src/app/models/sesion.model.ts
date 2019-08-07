import { SesionStates } from './sesionstatesenum.enum';
import * as moment from 'moment';

export interface Sesion {
  idSesion: number;
  empno: string;
  started: moment.Moment;
  lager: string;
  statusSesion: SesionStates;
}
