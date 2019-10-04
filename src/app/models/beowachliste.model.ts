import { LagerControl } from './lagercontrol.model';
import { LagerBestand } from './lagerbestand.model';
import { Bestellungsvorschlag } from './bestellungsvorschlag.model';

export interface BeowachtungsListe {
  lagercontrol: LagerControl;
  lagerbestand: LagerBestand;
  bestellungsvorschlag: Bestellungsvorschlag;
}
