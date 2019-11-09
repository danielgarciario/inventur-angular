import {
  Component,
  Input,
  Output,
  EventEmitter,
  Inject,
  OnInit,
  OnDestroy
} from '@angular/core';
import { SesionPos } from 'src/app/models/sespos.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Action, Store, props, select } from '@ngrx/store';
import { AppEstado } from 'src/app/root-store/root-store.state';
import {
  AddSesionPosFailed,
  ChangePosGezahlDetailID
} from 'src/app/root-store/sessions-store/actions';
import * as fromSesionSelector from '../../../../root-store/sessions-store/selectors';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  FormBuilder,
  ValidationErrors
} from '@angular/forms';
import { UniqueSerialByArtikelValidator } from 'src/app/services/UniqueSerialByArtikelValidator.service';
import { Observable, of, Subscription, combineLatest } from 'rxjs';
import {
  concatMap,
  withLatestFrom,
  map,
  switchMap,
  startWith
} from 'rxjs/operators';
import { GezahltID } from 'src/app/models/Gezaehlt.model';
import * as FromSesionActions from '../../../../root-store/sessions-store/actions';
import { Validador } from 'src/app/helpers-module/Validador/validador.model';
import {
  DefineTipoValidador,
  ValidadorNoEstaVacio,
  DefineTipoValidadorMaximoLargo,
  ValidadorMayorIgualQueCero,
  DefineTipoValidadorMenorIgualQue
} from 'src/app/helpers-module/Validador/DefineTipoValidador.model';
import { TipoValidador } from 'src/app/helpers-module/Validador/TipoValidador.interface';

export interface DialogGezhaltIDData {
  idgezhalt: number;
  sespos: SesionPos;
  serl: string;
  gezahlt: number;
  comment: string;
  Ok: boolean;
}

export class CheckIDExiste extends DefineTipoValidador<string> {
  private serials = new Array<string>();
  private subserials: Subscription;
  private isloading = true;
  constructor(private store$: Store<AppEstado>) {
    super('ID Nr. schon vorhandeln');
    this.getSerials();
    this.fValidacionOK = (e) => {
      if (this.isloading) {
        return true;
      }
      return this.serials.filter((x) => x === e).length === 0;
    };
  }

  onUnsubscribe() {
    this.subserials.unsubscribe();
  }
  private getSerials() {
    this.store$
      .pipe(
        select(fromSesionSelector.DamePosiciones),
        withLatestFrom(
          this.store$.pipe(select(fromSesionSelector.DameSelectedPosition))
        ),
        map(([p, sp]) => {
          const pma = p.filter(
            (x) => x.artikel.artikelnr === sp.artikel.artikelnr
          );
          const salida = new Array<string>();
          if (pma.length === 0) {
            return salida;
          }
          for (const sespos of pma) {
            for (const gez of sespos.gezahlt) {
              salida.push(gez.serl.toUpperCase());
            }
          }
          return salida;
        })
      )
      .subscribe((d) => {
        console.log('cargando serials', d);
        this.serials = d;
        this.isloading = false;
      });
  }
}

@Component({
  selector: 'app-dialog-position-gezhaltid',
  templateUrl: './posnewgezid.dialog.component.html',
  styleUrls: ['./posnewgezid.dialog.component.scss']
})
export class DialogPosicionGezhaltIDComponent implements OnInit, OnDestroy {
  numsert: Validador;
  gezhalt: Validador;
  comments: Validador;
  serialAlreadyExists = false;
  // subserialchanges: Subscription;
  private checkID: CheckIDExiste;
  noSePuedeGrabar$: Observable<boolean>;

  constructor(
    public dialogo: MatDialogRef<DialogPosicionGezhaltIDComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogGezhaltIDData,
    private store$: Store<AppEstado>
  ) {}

  ngOnInit() {
    const numsertvalidators = new Array<TipoValidador>();
    numsertvalidators.push(ValidadorNoEstaVacio);
    this.checkID = new CheckIDExiste(this.store$);
    numsertvalidators.push(this.checkID);
    numsertvalidators.push(new DefineTipoValidadorMaximoLargo(30));

    const gezahltvalidators = new Array<TipoValidador>();
    gezahltvalidators.push(ValidadorMayorIgualQueCero);
    gezahltvalidators.push(new DefineTipoValidadorMenorIgualQue(1));

    this.numsert = new Validador(
      new FormControl(this.data.serl),
      numsertvalidators
    );
    this.gezhalt = new Validador(
      new FormControl(this.data.gezahlt),
      gezahltvalidators
    );
    this.comments = new Validador(new FormControl(this.data.comment));
    this.noSePuedeGrabar$ = combineLatest(
      this.numsert.hayerrores$.pipe(startWith(this.numsert.tieneErrores)),
      this.gezhalt.hayerrores$.pipe(startWith(this.gezhalt.tieneErrores))
    ).pipe(map(([n, g]) => n || g));

    // this.gzidForm = new FormGroup({
    //   numsert: new FormControl(
    //     {
    //       value: this.data.serl,
    //       disabled: this.data.serl.length > 0
    //     },

    //     [Validators.required, Validators.maxLength(30)]
    //     // asyncValidators: [
    //     //   this.serialnrValidator.validate.bind(this.serialnrValidator)
    //     // ],
    //     // this.validateSerialNumberNotTaken.bind(this)
    //   ),
    //   gezhalt: new FormControl(this.data.gezahlt, {
    //     validators: [Validators.min(0), Validators.max(1)]
    //   }),
    //   comment: new FormControl(this.data.comment)
    // });
    // this.subserialchanges = this.numsert.valueChanges
    //   .pipe(switchMap((v: string) => this.testSiExiste(v)))
    //   .subscribe((yex) => (this.serialAlreadyExists = yex));
  }

  ngOnDestroy() {
    // this.subserialchanges.unsubscribe();
    this.checkID.onUnsubscribe();
  }

  public close() {
    this.dialogo.close();
  }
  public ok() {
    this.data.Ok = true;
    let sal: DialogGezhaltIDData;
    sal = { ...this.data };
    sal.serl = this.numsert.formulario.value;
    sal.gezahlt = this.gezhalt.formulario.value;
    sal.comment = this.comments.formulario.value;
    this.store$.dispatch(
      FromSesionActions.ChangePosGezahlDetailID({ gdid: sal })
    );
    this.close();
  }

  testSiExiste(serl: string): Observable<boolean> {
    return this.store$.pipe(
      select(fromSesionSelector.DamePosiciones),
      concatMap((p) =>
        of(p).pipe(
          withLatestFrom(
            this.store$.pipe(select(fromSesionSelector.DameSelectedPosition))
          )
        )
      ),
      map(([p, s]) => {
        if (serl.length === 0) {
          return false;
        }
        const op = p.filter((x) => x.artikel.artikelnr === s.artikel.artikelnr);
        if (op.length === 0) {
          return false;
        }
        const sr = op.map((x) => x.gezahlt);
        const plano: Array<GezahltID> = [].concat(...sr);
        if (plano.length === 0) {
          return false;
        }
        const planofiltro = plano.filter((x) => x.serl === serl);
        console.log(`Validation Serial: ${planofiltro.length >= 1}`);
        return planofiltro.length >= 1;
      })
    );
  }
  /* ESTO NO FUNCIONA y NO SE PORQUE ****
  validateSerialNumberNotTaken(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    return this.testSiExiste(control.value).pipe(
      map((r) => {
        if (r) {
          return { idNummerSchonBenutzt: true };
        }
        return null;
      })
    );
  }
*/
  // get numsert(): FormControl {
  //   return this.gzidForm.get('numsert') as FormControl;
  // }
  // get gezhalt(): FormControl {
  //   return this.gzidForm.get('gezhalt') as FormControl;
  // }
  // get comment(): FormControl {
  //   return this.gzidForm.get('comment') as FormControl;
  // }
  // get serialinput(): string {
  //   if (this.numsert === null) {
  //     return '';
  //   }
  //   return this.numsert.value as string;
  // }
  // get f() {
  //   return this.gzidForm.controls;
  // }
}
