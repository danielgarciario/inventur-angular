import {
  Component,
  OnDestroy,
  AfterViewInit,
  Input,
  OnInit
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  LeadTime,
  Pedidos,
  LeadTimeDetalles
} from 'src/app/models/leadtime.model';
import * as moment from 'moment';
import { Lieferant } from 'src/app/models/lieferant.model';
import { getTreeControlFunctionsMissingError } from '@angular/cdk/tree';

@Component({
  selector: 'app-beo-leadtime',
  templateUrl: './leadtimebeowach.component.html',
  styleUrls: ['./leadtimebeowach.component.css']
})
export class LeadTimeBeowachComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() leadtime$: Observable<LeadTime>;

  subleadtime: Subscription;
  isloading = true;
  isEmpty = true;
  leadtime: LeadTime;

  ngOnInit() {
    this.subleadtime = this.leadtime$.subscribe((l) => {
      this.leadtime = l;
      this.isloading = false;
      if (l) {
        this.isEmpty = false;
        l.pedidos.sort((a, b) => {
          const d1 = moment.max(a.detalles.map((x) => moment(x.btldatum)));
          const d2 = moment.max(b.detalles.map((x) => moment(x.btldatum)));
          return d2.valueOf() - d1.valueOf();
        });
      }
    });
  }
  ngAfterViewInit() {}

  ngOnDestroy() {}

  private unicos(ped: Pedidos): Array<number> {
    if (ped === undefined) {
      return null;
    }
    if (ped.detalles === undefined) {
      return null;
    }
    return [...new Set(ped.detalles.map((x) => x.wochen))].sort(
      (n1, n2) => n2 - n1
    );
  }
  private getnumsemanas(ped: Pedidos): Array<number> {
    if (ped === undefined) {
      return null;
    }
    if (ped.detalles === undefined) {
      return null;
    }
    return ped.detalles.map((x) => x.wochen);
  }

  getMode(ped: Pedidos): number {
    const grupos = this.unicos(ped);
    if (grupos === null) {
      return 0;
    }
    const semanas = this.getnumsemanas(ped);
    const cuentas = new Array<number>();
    for (const numero of grupos) {
      cuentas.push(semanas.filter((x) => x === numero).length);
    }
    let i = 0;
    let max = -1;
    let actualmax = 0;
    for (const cuenta of cuentas) {
      if (cuenta > max) {
        max = cuenta;
        actualmax = grupos[i];
      }
      i += 1;
    }
    return actualmax;
  }

  getMedia(ped: Pedidos): number {
    const semanas = this.getnumsemanas(ped);
    if (semanas === null) {
      return 0;
    }
    return semanas.reduce((a, b) => a + b) / semanas.length;
  }
  getMax(ped: Pedidos): number {
    return this.getnumsemanas(ped).sort((a, b) => b - a)[0];
  }
}
