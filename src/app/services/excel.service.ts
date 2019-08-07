import { Injectable } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as ExcelProper from 'exceljs';
import { saveAs } from 'file-saver';
import * as fromPipes from '../sessions/components/sesion/sumbestand.pipe';
import { SesionPos } from '../models/sespos.model';
// import { DatePipe } from '@angular/common';
// import * as moment from 'moment';

/* Quelle:
https://www.ngdevelop.tech/export-to-excel-in-angular-6/
*/
@Injectable({ providedIn: 'root' })
export class ExcelService {
  constructor(
    private sumbestandPipe: fromPipes.SumBestandOnHandPipe,
    private sumgezahltPipe: fromPipes.SumGezahltPipe,
    private moment2ExcelPipe: fromPipes.Moment2ExcelPipe
  ) {}

  grabaWorkbook(libro: ExcelProper.Workbook, destino: string) {
    libro.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, destino);
    });
  }
  generaWorkBookPosiciones(posiciones: Array<SesionPos>): ExcelProper.Workbook {
    const wb = new Excel.Workbook();
    const wspos = wb.addWorksheet('Positions');
    const wsID = wb.addWorksheet('IDs');
    wspos.columns = [
      { header: 'IdPosition', key: 'id', width: 10 },
      { header: 'IdSesion', key: 'idsesion', width: 10 },
      {
        header: 'Datum',
        key: 'checkedam',
        width: 20,
        style: { numFmt: 'dd.MM.yyyy HH:mm:ss' }
      },
      {
        header: 'Artikel Nr',
        key: 'artikelnr',
        width: 15,
        style: { numFmt: '@' }
      },
      {
        header: 'Artikel Besch.',
        key: 'beschreibung',
        width: 75,
        style: { numFmt: '@' }
      },
      { header: 'Artikel Art', key: 'artikelart', width: 10 },
      { header: 'Mit ID Nummer', key: 'seri', width: 10 },
      { header: 'Lager', key: 'cwar', width: 10, style: { numFmt: '@' } },
      { header: 'Lagerplatz', key: 'loca', width: 15, style: { numFmt: '@' } },
      { header: 'BestandAnzahl', key: 'btnd', width: 15 },
      { header: 'GezähltAnzahl', key: 'gezahl', width: 15 }
    ];

    posiciones.forEach((p) => {
      const fila = {
        id: p.idsespos,
        idsesion: p.idsesion,
        checkedam: this.moment2ExcelPipe.transform(p.checkedam),
        artikelnr: p.artikel.artikelnr,
        beschreibung: p.artikel.beschreibung,
        artikelart: p.artikel.artikelart,
        seri: p.artikel.seri === 1 ? 'Ja' : 'Nein',
        cwar: p.lagerort.lager,
        loca: p.lagerort.lagerplatz,
        btnd: this.sumbestandPipe.transform(p.bestand),
        gezahl: this.sumgezahltPipe.transform(p.gezahlt)
      };
      wspos.addRow(fila).commit();
    });

    return wb;
  }
}
