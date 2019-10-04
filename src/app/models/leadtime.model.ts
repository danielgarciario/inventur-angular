import { Lieferant } from './lieferant.model';
import * as Moment from 'moment';

export interface LeadTimeDetalles {
  btldatum: Moment.Moment;
  wedatum: Moment.Moment;
  naturaltage: number;
  wochen: number;
}

export interface Pedidos {
  lieferant: Lieferant;
  detalles: Array<LeadTimeDetalles>;
}

export interface LeadTime {
  articulo: string;
  cwar: string;
  pedidos: Array<Pedidos>;
}
