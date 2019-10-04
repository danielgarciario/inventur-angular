import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { LagerControl } from 'src/app/models/lagercontrol.model';
import { FormControl } from '@angular/forms';
import { Observable, Subscription, BehaviorSubject, combineLatest } from 'rxjs';
import {
  delay,
  startWith,
  tap,
  debounce,
  debounceTime,
  map
} from 'rxjs/operators';
import { Capacidades } from 'src/app/models/capacidades.model';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { EditMaxBestandDialogComponent } from './editmaxbestand/editmaxbestandbeowach.component';
import { ControlListeFacadeService } from 'src/app/services/facade/controlListe.facade.service';
import { Validador } from 'src/app/helpers-module/Validador/validador.model';
import { ValidadorMayorIgualQueCero } from 'src/app/helpers-module/Validador/DefineTipoValidador.model';
import { ValidadorTipo } from 'src/app/helpers-module/Validador/VadlidadorTipo.model';
import { ConjuntoValidadoresTipo } from 'src/app/helpers-module/Validador/ConjuntoValidadores.model';

@Component({
  selector: 'app-beo-lagercontrol',
  templateUrl: './lagercontrolbeowach.component.html',
  styleUrls: ['./lagercontrolbeowach.component.css']
})
export class LagerControlBeowachComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() lagercontrol$: Observable<LagerControl>;

  lagercontrol: LagerControl;
  isloading = true;
  sublagercontrol: Subscription;
  noSePuedeGrabar$: Observable<boolean>;

  meldungbfc: ValidadorTipo<number>;
  mindestbfc: ValidadorTipo<number>;
  conjunto: ConjuntoValidadoresTipo;

  constructor(
    private dialogo: MatDialog,
    private beo: ControlListeFacadeService,
    private snackBar: MatSnackBar
  ) {}

  funcComparaNumeros(v: number, vi: number) {
    return Math.abs(v - vi) <= 0.001;
  }

  ngOnInit() {
    this.meldungbfc = new ValidadorTipo<number>(
      new FormControl(0),
      [ValidadorMayorIgualQueCero],
      this.lagercontrol$.pipe(map((lc) => lc.meldungsbestand))
    );
    this.meldungbfc.funcSonIguales = this.funcComparaNumeros;
    this.mindestbfc = new ValidadorTipo<number>(
      new FormControl(0),
      [ValidadorMayorIgualQueCero],
      this.lagercontrol$.pipe(map((lc) => lc.mindestbestellmenge))
    );
    this.mindestbfc.funcSonIguales = this.funcComparaNumeros;

    this.conjunto = new ConjuntoValidadoresTipo([
      this.meldungbfc,
      this.mindestbfc
    ]);
    this.noSePuedeGrabar$ = this.conjunto.conjuntodisabled;

    // this.noSePuedeGrabar$ = combineLatest(
    //   this.meldungbfc.hayerrores$.pipe(startWith(this.meldungbfc.tieneErrores)),
    //   this.mindestbfc.hayerrores$.pipe(startWith(this.mindestbfc.tieneErrores))
    // ).pipe(map(([mel, mind]) => mel || mind));

    this.sublagercontrol = this.lagercontrol$
      .pipe(
        //     // tap((lc) => {
        //     //   this.lagercontrol = lc;
        //     //   this.meldungbfc.formulario.setValue(
        //     //     this.lagercontrol.meldungsbestand
        //     //   );
        //     //   this.mindestbfc.formulario.setValue(
        //     //     this.lagercontrol.mindestbestellmenge
        //     //   );
        //     // }),
        tap(() => {
          this.isloading = false;
        })
      )
      .subscribe();
  }

  hacambiadoelvalor(): boolean {
    if (this.isloading) {
      return false;
    }
    const cambiomeldung =
      this.meldungbfc.formulario.value !== this.lagercontrol.meldungsbestand;
    const cambiomindst =
      this.mindestbfc.formulario.value !==
      this.lagercontrol.mindestbestellmenge;
    return cambiomeldung || cambiomindst;
  }

  ngAfterViewInit() {}

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
  onGrabalo() {
    this.beo
      .updateMeldungsundMindestBestand(
        this.lagercontrol,
        +this.meldungbfc.formulario.value,
        +this.mindestbfc.formulario.value
      )
      .subscribe((salida) => {
        this.snackBar.open(
          salida.length > 0 ? salida : 'Erfolgreich gespeichert!!',
          null,
          { duration: 5000 }
        );
      });
  }

  ngOnDestroy() {
    this.sublagercontrol.unsubscribe();
    // this.submeldchanges.unsubscribe();
    // this.submindchanges.unsubscribe();
    // this.suberroresmeld.unsubscribe();
    // this.suberroresmind.unsubscribe();
  }
}
