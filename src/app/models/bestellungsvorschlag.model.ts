import * as moment from 'moment';
import { Lieferant } from './lieferant.model';

export interface Bestellungsvorschlag {
  orno: string;
  datum: moment.Moment;
  lieferant: Lieferant;
  menge: number;
}
