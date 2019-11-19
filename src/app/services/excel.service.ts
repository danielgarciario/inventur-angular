import { Injectable } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
// import * as ExcelProper from 'exceljs';
import * as fs from 'file-saver';
import * as fromPipes from '../sessions/components/sesion/sumbestand.pipe';
import { SesionPos } from '../models/sespos.model';
import { Observable } from 'rxjs';
import { BeowachtService } from './beowacht.service';
import { BeowachtungsListe } from '../models/beowachliste.model';
// import { DatePipe } from '@angular/common';
// import * as moment from 'moment';

/* Quelle:
https://www.ngdevelop.tech/export-to-excel-in-angular-6/
NO FUNCIONA!!
Ultimo Recurso:
https://stackoverflow.com/questions/56996774/exceljs-not-working-in-production-in-angular-6
*/

declare const ExcelJS: any;

@Injectable({ providedIn: 'root' })
export class ExcelService {
  constructor(
    private sumbestandPipe: fromPipes.SumBestandOnHandPipe,
    private sumgezahltPipe: fromPipes.SumGezahltPipe,
    private moment2ExcelPipe: fromPipes.Moment2ExcelPipe
  ) {}

  // private grabaWorkbook(libro: ExcelProper.Workbook, destino: string) {
  //   libro.xlsx.writeBuffer().then((data) => {
  //     const blob = new Blob([data], {
  //       type:
  //         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  //     });
  //     fs.saveAs(blob, destino);
  //   });
  // }
  // private generaWorkBookPosiciones(
  //   posiciones: Array<SesionPos>
  // ): ExcelProper.Workbook {
  //   const wb = new Excel.Workbook();
  //   const wspos = wb.addWorksheet('Positions');
  //   const wsID = wb.addWorksheet('IDs');
  //   wspos.columns = [
  //     { header: 'IdPosition', key: 'id', width: 10 },
  //     { header: 'IdSesion', key: 'idsesion', width: 10 },
  //     {
  //       header: 'Datum',
  //       key: 'checkedam',
  //       width: 20,
  //       style: { numFmt: 'dd.MM.yyyy HH:mm:ss' }
  //     },
  //     {
  //       header: 'Artikel Nr',
  //       key: 'artikelnr',
  //       width: 15,
  //       style: { numFmt: '@' }
  //     },
  //     {
  //       header: 'Artikel Besch.',
  //       key: 'beschreibung',
  //       width: 75,
  //       style: { numFmt: '@' }
  //     },
  //     { header: 'Artikel Art', key: 'artikelart', width: 10 },
  //     { header: 'Mit ID Nummer', key: 'seri', width: 10 },
  //     { header: 'Lager', key: 'cwar', width: 10, style: { numFmt: '@' } },
  //     { header: 'Lagerplatz', key: 'loca', width: 15, style: { numFmt: '@' } },
  //     { header: 'BestandAnzahl', key: 'btnd', width: 15 },
  //     { header: 'GezähltAnzahl', key: 'gezahl', width: 15 }
  //   ];

  //   posiciones.forEach((p) => {
  //     const fila = {
  //       id: p.idsespos,
  //       idsesion: p.idsesion,
  //       checkedam: this.moment2ExcelPipe.transform(p.checkedam),
  //       artikelnr: p.artikel.artikelnr,
  //       beschreibung: p.artikel.beschreibung,
  //       artikelart: p.artikel.artikelart,
  //       seri: p.artikel.seri === 1 ? 'Ja' : 'Nein',
  //       cwar: p.localizador.lager,
  //       loca: p.localizador.lagerplatz,
  //       btnd: this.sumbestandPipe.transform(p.bestand),
  //       gezahl: this.sumgezahltPipe.transform(p.gezahlt)
  //     };
  //     wspos.addRow(fila).commit();
  //   });

  //   return wb;
  // }
  // private generaWorkBookBeoCheckBestand(
  //   listabeo: Array<BeowachtungsListe>
  // ): ExcelProper.Workbook {
  //   const wb = new Excel.Workbook();
  //   const wschbestand = wb.addWorksheet('CheckBestand');
  //   wschbestand.columns = [
  //     { header: '' },
  //     { header: 'lager', key: 'cwar' },
  //     { header: 'item', key: 'item', width: 10, style: { numFmt: '@' } },
  //     { header: 'Bez', key: 'cdf_beza', width: 15, style: { numFmt: '@' } },
  //     { header: 'Meldungsbenstand', key: 'mb' },
  //     { header: '', key: 'mbcuni' },
  //     { header: 'OnHnd', key: 'onhnd' },
  //     { header: '', key: 'ohndcuni' },
  //     { header: 'Bestellt', key: 'qord' },
  //     { header: '', key: 'qordcuni' },
  //     { header: 'Gesperrt.', key: 'qblk' },
  //     { header: '', key: 'qblkcuni' },
  //     { header: 'Reservi.', key: 'qall' },
  //     { header: '', key: 'qallcuni' },
  //     { header: 'Verfügbar', key: 'dispo' },
  //     { header: '', key: 'dispocuni' },
  //     { header: 'Mindestbest.', key: 'mindest' },
  //     { header: '', key: 'mindcuni' },
  //     { header: 'BestVor', key: 'orno', style: { numFmt: '@' } },
  //     {
  //       header: 'Datum',
  //       key: 'datum',
  //       style: { numFmt: 'dd.MM.yyyy HH:mm:ss' }
  //     },
  //     { header: 'Lieferant', key: 'liefn', style: { numFmt: '@' } },
  //     { header: '', key: 'liefnam', style: { numFmt: '@' } },
  //     { header: 'Bestellt.', key: 'menge' },
  //     { header: '', key: 'btlcuni' }
  //   ];
  //   listabeo.forEach((lb) => {
  //     const cuni = lb.lagercontrol.articulo.cuni;
  //     const fila = {
  //       cwar: lb.lagercontrol.cwar,
  //       item: lb.lagercontrol.articulo.artikelnr,
  //       ohndcuni: cuni,
  //       qordcuni: cuni,
  //       qblkcuni: cuni,
  //       qallcuni: cuni,
  //       dispocuni: cuni,
  //       mindcuni: cuni,
  //       btlcuni: cuni,
  //       mbcuni: cuni,
  //       cdf_beza: lb.lagercontrol.articulo.beschreibung,
  //       mb: lb.lagercontrol.meldungsbestand,
  //       onhnd: lb.lagerbestand.qhnd,
  //       qord: lb.lagerbestand.qord,
  //       qall: lb.lagerbestand.qall,
  //       qblk: lb.lagerbestand.qblk,
  //       dispo: lb.lagerbestand.disponible,
  //       mindest: lb.lagercontrol.mindestbestellmenge,
  //       orno: lb.bestellungsvorschlag ? lb.bestellungsvorschlag.orno : '',
  //       datum: lb.bestellungsvorschlag
  //         ? this.moment2ExcelPipe.transform(lb.bestellungsvorschlag.datum)
  //         : '',
  //       liefn: lb.bestellungsvorschlag
  //         ? lb.bestellungsvorschlag.lieferant.liefnr
  //         : '',
  //       liefnam: lb.bestellungsvorschlag
  //         ? lb.bestellungsvorschlag.lieferant.liefname
  //         : '',
  //       menge: lb.bestellungsvorschlag ? lb.bestellungsvorschlag.menge : ''
  //     };
  //     wschbestand.addRow(fila).commit();
  //   });
  //   return wb;
  // }
  public grabaWorkBookBeoCheckBestand(
    datos: Array<BeowachtungsListe>,
    destino: string
  ) {
    console.log('Creando el Libro');
    // const libro = this.generaWorkBookBeoCheckBestand(datos);
    const wb = new ExcelJS.Workbook();
    const wschbestand = wb.addWorksheet('CheckBestand');
    wschbestand.columns = [
      { header: '' },
      { header: 'lager', key: 'cwar' },
      { header: 'item', key: 'item', width: 10, style: { numFmt: '@' } },
      { header: 'Bez', key: 'cdf_beza', width: 15, style: { numFmt: '@' } },
      { header: 'Meldungsbenstand', key: 'mb' },
      { header: '', key: 'mbcuni' },
      { header: 'OnHnd', key: 'onhnd' },
      { header: '', key: 'ohndcuni' },
      { header: 'Bestellt', key: 'qord' },
      { header: '', key: 'qordcuni' },
      { header: 'Gesperrt.', key: 'qblk' },
      { header: '', key: 'qblkcuni' },
      { header: 'Reservi.', key: 'qall' },
      { header: '', key: 'qallcuni' },
      { header: 'Verfügbar', key: 'dispo' },
      { header: '', key: 'dispocuni' },
      { header: 'Mindestbest.', key: 'mindest' },
      { header: '', key: 'mindcuni' },
      { header: 'BestVor', key: 'orno', style: { numFmt: '@' } },
      {
        header: 'Datum',
        key: 'datum',
        style: { numFmt: 'dd.MM.yyyy HH:mm:ss' }
      },
      { header: 'Lieferant', key: 'liefn', style: { numFmt: '@' } },
      { header: '', key: 'liefnam', style: { numFmt: '@' } },
      { header: 'Bestellt.', key: 'menge' },
      { header: '', key: 'btlcuni' }
    ];
    datos.forEach((lb) => {
      const cuni = lb.lagercontrol.articulo.cuni;
      const fila = {
        cwar: lb.lagercontrol.cwar,
        item: lb.lagercontrol.articulo.artikelnr,
        ohndcuni: cuni,
        qordcuni: cuni,
        qblkcuni: cuni,
        qallcuni: cuni,
        dispocuni: cuni,
        mindcuni: cuni,
        btlcuni: cuni,
        mbcuni: cuni,
        cdf_beza: lb.lagercontrol.articulo.beschreibung,
        mb: lb.lagercontrol.meldungsbestand,
        onhnd: lb.lagerbestand.qhnd,
        qord: lb.lagerbestand.qord,
        qall: lb.lagerbestand.qall,
        qblk: lb.lagerbestand.qblk,
        dispo: lb.lagerbestand.disponible,
        mindest: lb.lagercontrol.mindestbestellmenge,
        orno: lb.bestellungsvorschlag ? lb.bestellungsvorschlag.orno : '',
        datum: lb.bestellungsvorschlag
          ? this.moment2ExcelPipe.transform(lb.bestellungsvorschlag.datum)
          : '',
        liefn: lb.bestellungsvorschlag
          ? lb.bestellungsvorschlag.lieferant.liefnr
          : '',
        liefnam: lb.bestellungsvorschlag
          ? lb.bestellungsvorschlag.lieferant.liefname
          : '',
        menge: lb.bestellungsvorschlag ? lb.bestellungsvorschlag.menge : ''
      };
      wschbestand.addRow(fila).commit();
    });

    console.log('Creado el Libro... ahora a grabar');
    wb.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      fs.saveAs(blob, destino);
    });
  }
  public grabaWorkBookPosiciones(datos: Array<SesionPos>, destino: string) {
    console.log('Creando el libro');
    const wb = new ExcelJS.Workbook();
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

    datos.forEach((p) => {
      const fila = {
        id: p.idsespos,
        idsesion: p.idsesion,
        checkedam: this.moment2ExcelPipe.transform(p.checkedam),
        artikelnr: p.artikel.artikelnr,
        beschreibung: p.artikel.beschreibung,
        artikelart: p.artikel.artikelart,
        seri: p.artikel.seri === 1 ? 'Ja' : 'Nein',
        cwar: p.localizador.lager,
        loca: p.localizador.lagerplatz,
        btnd: this.sumbestandPipe.transform(p.bestand),
        gezahl: this.sumgezahltPipe.transform(p.gezahlt)
      };
      wspos.addRow(fila).commit();
    });
    // const wb = this.generaWorkBookPosiciones(datos);
    console.log('A grabar el libro');
    // this.grabaWorkbook(wb, destino);

    wb.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      fs.saveAs(blob, destino);
    });
  }
}
