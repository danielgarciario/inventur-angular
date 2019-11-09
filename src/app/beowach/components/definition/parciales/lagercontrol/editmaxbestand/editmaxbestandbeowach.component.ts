import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatSnackBar,
  getMatFormFieldPlaceholderConflictError
} from '@angular/material';
import { LagerControl } from 'src/app/models/lagercontrol.model';
import { ControlListeFacadeService } from 'src/app/services/facade/controlListe.facade.service';
import { Capacidades } from 'src/app/models/capacidades.model';
import { FormControl, Validators } from '@angular/forms';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { combineLatest } from 'rxjs';
import { FestLagerPLatz } from 'src/app/models/festelagerplatz.model';
import { Validador } from 'src/app/helpers-module/Validador/validador.model';
import { startWith, map, tap } from 'rxjs/operators';
import {
  DefineTipoValidador,
  ValidadorNoEstaVacio,
  ValidadorMayorIgualQueCero
} from 'src/app/helpers-module/Validador/DefineTipoValidador.model';

export class ValidadorExisteFesteLagerPlatz extends DefineTipoValidador<
  string
> {
  flp = new Array<string>();
  constructor(private festeLagerPlatze: Array<FestLagerPLatz>) {
    super('Lagerplatz ist nicht in der Festelagerplätze Liste für die Aritkel');
    this.getflp();
    this.fValidacionOK = (e) => {
      if (this.flp.length === 0) {
        return true;
      }
      return this.flp.filter((x) => x === e.toUpperCase()).length > 0;
    };
  }
  getflp() {
    this.flp = this.festeLagerPlatze.map((x) =>
      x.lagerort.lagerplatz.toUpperCase()
    );
  }
}
export class ValidadorYaExisteLagerPlatzEnCapacidades extends DefineTipoValidador<
  string
> {
  private cap = new Array<string>();
  constructor(private capacidades: Array<Capacidades>) {
    super('Lagerplatz schon in der Liste von Lagerplatz Kapazität');
    this.getcap();
    this.fValidacionOK = (e) => {
      if (this.cap.length === 0) {
        return true;
      }
      return this.cap.filter((x) => x === e.toUpperCase()).length > 0;
    };
  }
  getcap() {
    this.cap = this.capacidades.map((x) => x.lagerort.lagerplatz.toUpperCase());
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-editmaxbestand-dialog',
  templateUrl: './editmaxbestandbeowach.component.html',
  styleUrls: ['./editmaxbestandbeowach.component.css']
})
export class EditMaxBestandDialogComponent implements OnInit, OnDestroy {
  public lagerplatzFC: Validador;
  public maxBestandFC: Validador;
  public lagercontrol: LagerControl;

  noSepuedegrabar$: Observable<boolean>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      lagercontrol: LagerControl;
      cual: Capacidades;
    },
    private mdDialogRef: MatDialogRef<EditMaxBestandDialogComponent>,
    private snackBar: MatSnackBar,
    private beo: ControlListeFacadeService
  ) {
    this.lagercontrol = this.data.lagercontrol;
    this.lagerplatzFC = new Validador(
      new FormControl(this.data.cual.lagerort.lagerplatz),
      [
        ValidadorNoEstaVacio,
        new ValidadorExisteFesteLagerPlatz(this.lagercontrol.festelagerplaetze),
        new ValidadorYaExisteLagerPlatzEnCapacidades(
          this.lagercontrol.capacidades
        )
      ]
    );
    this.maxBestandFC = new Validador(new FormControl(this.data.cual.maxbtnd), [
      ValidadorMayorIgualQueCero
    ]);
    this.noSepuedegrabar$ = combineLatest(
      this.lagerplatzFC.hayerrores$.pipe(
        startWith(this.lagerplatzFC.tieneErrores)
      ),
      this.maxBestandFC.hayerrores$.pipe(
        startWith(this.maxBestandFC.tieneErrores)
      )
    ).pipe(
      tap((x) => console.log('no se puede grabar', x)),
      map(([lp, mx]) => lp || mx)
    );
  }

  public close() {
    this.mdDialogRef.close();
  }
  public cancel() {
    this.close();
  }

  public grabalo() {
    const nuevo: Capacidades = {
      maxbtnd: this.maxBestandFC.formulario.value,
      lagerort: {
        lager: this.lagercontrol.cwar,
        lagerplatz: this.lagerplatzFC.formulario.value
      }
    };
    this.beo
      .updateLagerMaxBestand(nuevo, this.data.cual, this.lagercontrol)
      .subscribe((salida) => {
        if (salida.length === 0) {
          this.close();
        } else {
          this.snackBar.open(salida, null, { duration: 5000 });
        }
      });
  }
  public copiaLagerbestand(cual: FestLagerPLatz) {
    this.lagerplatzFC.formulario.setValue(cual.lagerort.lagerplatz);
  }

  ngOnInit() {}
  ngOnDestroy() {
    // this.sublpchanges.unsubscribe();
    // this.submxbtndchanges.unsubscribe();
    // this.suberroreslp.unsubscribe();
    // this.suberroresmxbtn.unsubscribe();
  }
}
