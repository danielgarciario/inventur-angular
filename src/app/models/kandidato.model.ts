import { Artikel } from './artikel.model';
import { LagerOrt, Localizador } from './lagerort.model';

export interface Kandidato {
  articulo: Artikel;
  lagerort: Localizador; // <-- OJO Cambiamos LagerOrt por Localizador
}
