import { SerialArtikelEnum } from './serialartikelenum.enum';
import { Artikelartenum } from './artikelartenum.enum';

export interface Artikelbase {
  artikelnr: string;
  beschreibung: string;
  cuni: string;
}

export interface Artikel extends Artikelbase {
  artikelart: Artikelartenum;
  seri: SerialArtikelEnum;
}
