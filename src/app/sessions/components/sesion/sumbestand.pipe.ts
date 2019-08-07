import { Pipe, PipeTransform } from '@angular/core';
import { BestandID } from 'src/app/models/bestand.model';
import { GezahltID } from 'src/app/models/Gezaehlt.model';
import * as moment from 'moment';

@Pipe({ name: 'getSumBestandOnHnd' })
export class SumBestandOnHandPipe implements PipeTransform {
  transform(bestand: Array<BestandID>): number {
    return bestand.reduce((acumulador, besta) => acumulador + besta.qhnd, 0);
  }
}

@Pipe({ name: 'getSumGezahlt' })
export class SumGezahltPipe implements PipeTransform {
  transform(gez: Array<GezahltID>): number {
    return gez.reduce((acumulador, g) => acumulador + g.gezahlt, 0);
  }
}

@Pipe({ name: 'Moment2Excel' })
export class Moment2ExcelPipe implements PipeTransform {
  transform(dat: moment.Moment): number {
    const fecha = moment(dat);
    const refdate = moment('1900-01-01', 'YYYY-MM-DD');
    const dias = Math.floor(moment.duration(fecha.diff(refdate)).asDays()) + 2;
    const midnight = fecha.clone().startOf('day');
    const segundos = fecha.diff(midnight, 'seconds');
    return dias + segundos / (24 * 3600);
  }
}
