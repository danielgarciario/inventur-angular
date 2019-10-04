import { LagerOrt } from './lagerort.model';
import * as moment from 'moment';
import { Artikelbase } from './artikel.model';

export interface Basekorrektur {
  idsesion: number;
  idsesionpos: number;
  lagerort: LagerOrt;
  artikel: Artikelbase;
  korrekturkomment: string;
  chekedam: moment.Moment;
  bqhnd: number;
  gezehlt: number;
  aqhnd: number;
}

export interface KorrekturMasiv extends Basekorrektur {
  gezkomment: string;
  kauftrag: number;
}

export interface IdKorrekturID {
  serial: string;
  tipo: string;
  kauftrag: number;
}

export interface KorrekturID extends Basekorrektur {
  serials: Array<IdKorrekturID>;
}
