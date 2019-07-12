import { Artikel } from './artikel.model';
import { SesionStates } from './sesionstatesenum.enum';
import { LagerOrt } from './lagerort.model';
import { BestandID } from './bestand.model';
import { GezahltID } from './Gezaehlt.model';

export interface SesionPos {
  idsespos: number;
  idsesion: number;
  checkedam: Date;
  artikel: Artikel;
  lagerort: LagerOrt;
  status: SesionStates;
  bestand: Array<BestandID>;
  gezahlt: Array<GezahltID>;
}
