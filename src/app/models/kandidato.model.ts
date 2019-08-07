import { Artikel } from './artikel.model';
import { LagerOrt } from './lagerort.model';

export interface Kandidato {
  articulo: Artikel;
  lagerort: LagerOrt;
}
