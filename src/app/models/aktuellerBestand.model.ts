import * as moment from 'moment';

export interface AktuellerBestand {
  quelle: number;
  loca: string;
  onhand: number;
  gesperrt: number;
  ordered: number;
  transit: number;
  reserviert: number;
  letzteBuchung: moment.Moment;
}
