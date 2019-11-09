import { Artikel } from './artikel.model';
import { SesionStates } from './sesionstatesenum.enum';
import { LagerOrt, Localizador } from './lagerort.model';
import { BestandID } from './bestand.model';
import { GezahltID } from './Gezaehlt.model';
import * as moment from 'moment';

export interface SesionPos {
  idsespos: number;
  idsesion: number;
  checkedam: moment.Moment;
  artikel: Artikel;
  localizador: Localizador;
  status: SesionStates;
  bestand: Array<BestandID>;
  gezahlt: Array<GezahltID>;
}
