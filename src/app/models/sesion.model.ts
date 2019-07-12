import { SesionStates } from './sesionstatesenum.enum';

export interface Sesion {
  idSesion: number;
  empno: string;
  started: Date;
  lager: string;
  statusSesion: SesionStates;
}
