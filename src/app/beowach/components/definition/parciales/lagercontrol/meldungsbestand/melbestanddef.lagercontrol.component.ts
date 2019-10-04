import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LagerControl } from 'src/app/models/lagercontrol.model';
import { ControlListeFacadeService } from 'src/app/services/facade/controlListe.facade.service';
import { MatSnackBar } from '@angular/material';
import { ConjuntoValidadoresTipo } from 'src/app/helpers-module/Validador/ConjuntoValidadores.model';
import { ValidadorTipo } from 'src/app/helpers-module/Validador/VadlidadorTipo.model';
import { FormControl } from '@angular/forms';
import { ValidadorMayorIgualQueCero } from 'src/app/helpers-module/Validador/DefineTipoValidador.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-beo-lagercontrol-meldungbestand',
  templateUrl: './melbestanddef.lagercontrol.component.html',
  styleUrls: ['./melbestanddef.lagercontrol.component.css']
})
export class MeldungsMindesLagerControlBeowachComponent
  implements OnInit, OnDestroy {
  @Input() lagercontrol$: Observable<LagerControl>;

  isLoading = true;
  lagercontrol: LagerControl = null;
  cuni = '';
  sublagercontrol: Subscription;

  noSePuedeGrabar$: Observable<boolean>;

  meldungbfc: ValidadorTipo<number>;
  mindestbfc: ValidadorTipo<number>;
  conjunto: ConjuntoValidadoresTipo;

  constructor(
    private beo: ControlListeFacadeService,
    private snackBar: MatSnackBar
  ) {}

  private funcComparaNumeros(v: number, vi: number) {
    return Math.abs(v - vi) <= 0.001;
  }

  ngOnInit() {
    this.sublagercontrol = this.lagercontrol$.subscribe((lc) => {
      this.lagercontrol = lc;
      this.cuni = lc.articulo.cuni;
      this.isLoading = false;
    });
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
  }
}
