import { SesionStates } from './sesionstatesenum.enum';

export interface Gezahlt {
  idgezahlt: number;
  idsespos: number;
  gezahlt: number;
  comment: string;
  status: SesionStates;
}

export interface GezahltID extends Gezahlt {
  serl: string;
}
