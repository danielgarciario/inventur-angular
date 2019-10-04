import { Artikel } from './artikel.model';
import { LagerOrt } from './lagerort.model';
import { Capacidades } from './capacidades.model';
import { FestLagerPLatz } from './festelagerplatz.model';

export interface LagerControl {
  articulo: Artikel;
  cwar: string;
  meldungsbestand: number;
  mindestbestellmenge: number;
  capacidades: Array<Capacidades>;
  festelagerplaetze: Array<FestLagerPLatz>;
}
