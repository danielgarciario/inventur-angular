import { Component, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LagerControl } from 'src/app/models/lagercontrol.model';
import { FestLagerPLatz } from 'src/app/models/festelagerplatz.model';
import { map } from 'rxjs/operators';
import { Capacidades } from 'src/app/models/capacidades.model';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { EditMaxBestandDialogComponent } from '../editmaxbestand/editmaxbestandbeowach.component';

@Component({
  selector: 'app-beo-lagercontrol-capacidad',
  templateUrl: './capacidaddef.lagercontrolbeo.component.html',
  styleUrls: ['./capacidaddef.lagercontrolbeo.component.css']
})
export class CapacidadesLagerControlBeowachComponent
  implements OnInit, OnDestroy {
  @Input() lagercontrol$: Observable<LagerControl>;

  lagercontrol: LagerControl;
  sublagercontrol: Subscription;

  festelagerplatz$: Observable<Array<FestLagerPLatz>>;
  capacidades$: Observable<Array<Capacidades>>;
  cuni$: Observable<string>;

  constructor(private dialogo: MatDialog) {}

  onEditKapacidad(cual: Capacidades) {
    const entrada = {
      lagercontrol: this.lagercontrol,
      cual
    };
    const dialogopts: MatDialogConfig = {
      data: entrada,
      width: '600px',
      height: '400px'
    };
    const dialogref = this.dialogo.open(
      EditMaxBestandDialogComponent,
      dialogopts
    );
  }

  ngOnInit() {
    this.festelagerplatz$ = this.lagercontrol$.pipe(
      map((x) => x.festelagerplaetze)
    );
    this.capacidades$ = this.lagercontrol$.pipe(map((x) => x.capacidades));
    this.cuni$ = this.lagercontrol$.pipe(map((x) => x.articulo.cuni));
    this.sublagercontrol = this.lagercontrol$.subscribe(
      (p) => (this.lagercontrol = p)
    );
  }
  ngOnDestroy() {
    this.sublagercontrol.unsubscribe();
  }
}
