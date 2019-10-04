import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { LagerControl } from 'src/app/models/lagercontrol.model';
import { switchMap } from 'rxjs/operators';
import {
  Paginador,
  TipoDefinicionOrden
} from '../../../../helpers-module/paginador/paginador.component';
import { Sort } from '@angular/material';

@Component({
  selector: 'app-beo-controlliste-index',
  templateUrl: './controllisteindex.component.html',
  styleUrls: ['./controllisteindex.component.css']
})
export class ControlListeIndexBeowachComponent implements OnInit, OnDestroy {
  @Input() articulos$: Observable<Array<LagerControl>>;
  @Input() loadingArticulos$: Observable<boolean>;
  @Output() deleteArtikel = new EventEmitter<LagerControl>();
  @Output() gotoArtikel = new EventEmitter<LagerControl>();

  mipaginador: Paginador<LagerControl>;

  ngOnInit() {
    const camposorden = new Array<TipoDefinicionOrden<LagerControl>>();
    camposorden.push({
      campo: 'artikelnr',
      funcascendente: (a, b) =>
        a.articulo.artikelnr < b.articulo.artikelnr ? -1 : 1
    });
    camposorden.push({
      campo: 'artbesch',
      funcascendente: (a, b) =>
        a.articulo.beschreibung < b.articulo.beschreibung ? -1 : 1
    });
    camposorden.push({
      campo: 'capacidad',
      funcascendente: (a, b) => {
        const minlba = a.capacidades.sort((aa, ba) =>
          aa.lagerort.lagerplatz < ba.lagerort.lagerplatz ? -1 : 1
        )[0].lagerort.lagerplatz;
        const minlbb = b.capacidades.sort((ab, bb) =>
          ab.lagerort.lagerplatz < bb.lagerort.lagerplatz ? -1 : 1
        )[0].lagerort.lagerplatz;
        return minlba < minlbb ? -1 : 1;
      }
    });

    this.mipaginador = new Paginador<LagerControl>(
      this.articulos$,
      camposorden
    );
  }

  onSort(cual: Sort) {
    this.mipaginador.onSort(cual);
  }

  ngOnDestroy() {}
}
