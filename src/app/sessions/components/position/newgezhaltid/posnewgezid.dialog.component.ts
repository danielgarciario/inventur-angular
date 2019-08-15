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
import { Observable, of, Subscription } from 'rxjs';
import { concatMap, withLatestFrom, map, switchMap } from 'rxjs/operators';
import { GezahltID } from 'src/app/models/Gezaehlt.model';
import * as FromSesionActions from '../../../../root-store/sessions-store/actions';

export interface DialogGezhaltIDData {
  idgezhalt: number;
  sespos: SesionPos;
  serl: string;
  gezahlt: number;
  comment: string;
  Ok: boolean;
}

@Component({
  selector: 'app-dialog-position-gezhaltid',
  templateUrl: './posnewgezid.dialog.component.html',
  styleUrls: ['./posnewgezid.dialog.component.scss']
})
export class DialogPosicionGezhaltIDComponent implements OnInit, OnDestroy {
  gzidForm: FormGroup;
  serialAlreadyExists = false;
  subserialchanges: Subscription;

  constructor(
    public dialogo: MatDialogRef<DialogPosicionGezhaltIDComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogGezhaltIDData,
    private store$: Store<AppEstado>
  ) {}

  ngOnInit() {
    this.gzidForm = new FormGroup({
      numsert: new FormControl(
        {
          value: this.data.serl,
          disabled: this.data.serl.length > 0
        },

        [Validators.required, Validators.maxLength(30)]
        // asyncValidators: [
        //   this.serialnrValidator.validate.bind(this.serialnrValidator)
        // ],
        // this.validateSerialNumberNotTaken.bind(this)
      ),
      gezhalt: new FormControl(this.data.gezahlt, {
        validators: [Validators.min(0), Validators.max(1)]
      }),
      comment: new FormControl(this.data.comment)
    });
    this.subserialchanges = this.numsert.valueChanges
      .pipe(switchMap((v: string) => this.testSiExiste(v)))
      .subscribe((yex) => (this.serialAlreadyExists = yex));
  }

  ngOnDestroy() {
    this.subserialchanges.unsubscribe();
  }

  public close() {
    this.dialogo.close();
  }
  public ok() {
    this.data.Ok = true;
    let sal: DialogGezhaltIDData;
    sal = { ...this.data };
    sal.serl = this.numsert.value;
    sal.gezahlt = this.gezhalt.value;
    sal.comment = this.comment.value;
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
  get numsert() {
    return this.gzidForm.get('numsert');
  }
  get gezhalt() {
    return this.gzidForm.get('gezhalt');
  }
  get comment() {
    return this.gzidForm.get('comment');
  }
  get serialinput(): string {
    if (this.numsert === null) {
      return '';
    }
    return this.numsert.value as string;
  }
  get f() {
    return this.gzidForm.controls;
  }
}
