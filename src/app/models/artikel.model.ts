import { SerialArtikelEnum } from './serialartikelenum.enum';
import { Artikelartenum } from './artikelartenum.enum';

export interface Artikel {
  artikelnr: string;
  artikelbeschreibung: string;
  cuni: string;
  artikelart: Artikelartenum;
  seri: SerialArtikelEnum;
}
