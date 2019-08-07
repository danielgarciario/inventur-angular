import * as moment from 'moment';

export interface Bestand {
  idbtnd: number;
  idsespos: number;
  qhnd: number;
  qblk: number;
  qlal: number;
  qord: number;
  ldatum: moment.Moment;
}

export interface BestandID extends Bestand {
  serl: string;
}
