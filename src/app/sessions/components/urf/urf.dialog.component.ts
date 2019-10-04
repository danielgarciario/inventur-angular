import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Artikel } from 'src/app/models/artikel.model';
import { SessionsService } from 'src/app/services/sessions.service';
import { Subscription } from 'rxjs';
import { Urf } from 'src/app/models/urf.model';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  AbstractControl,
  Validators
} from '@angular/forms';
import { map } from 'rxjs/operators';
import { isUndefined } from 'util';

@Component({
  selector: 'app-dialog-urf',
  templateUrl: './urf.dialog.component.html',
  styleUrls: ['./urf.dialog.component.scss']
})
export class DialogURFComponent implements OnInit, OnDestroy {
  public isloadingurfs: boolean;
  public urfs: Array<Urf>;
  private subsloadurfs: Subscription;
  private subsvaluechanges: Subscription;
  public formulario: FormGroup;
  public valores: Array<number>;

  constructor(
    public dialogo: MatDialogRef<DialogURFComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { artikel: Artikel; origen: number },
    private sesionservice: SessionsService,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({
      calculos: this.fb.array([])
    });
    this.valores = new Array<number>();
  }
  ngOnInit() {
    console.log('Arrancando URF');
    this.isloadingurfs = true;
    this.subsloadurfs = this.sesionservice
      .getURF(this.data.artikel.artikelnr)
      .pipe(
        map((u) => {
          console.log('Respuesta URF!!');
          this.isloadingurfs = false;
          this.urfs = u;
          this.addneue(this.data.origen);
        })
      )
      .subscribe();
    this.subsvaluechanges = this.formulario.valueChanges
      .pipe(
        map((x) => {
          if (Array.isArray(x.calculos)) {
            const myar = x.calculos as Array<{
              einheit: string;
              menge: number;
            }>;
            let index = 0;
            for (const d of myar) {
              if (!isUndefined(d.menge) && !isUndefined(d.einheit)) {
                this.valores[index] = this.recalcula(d.menge, d.einheit);
              }
              index++;
            }
          }
        })
      )
      .subscribe();
  }

  get total(): number {
    if (this.valores.length === 0) {
      return 0;
    }
    return this.valores.reduce((v, a) => {
      return v + a;
    });
  }

  get fcalculos(): FormArray {
    return this.formulario.controls.calculos as FormArray;
  }
  fdetalle(i: number): FormGroup {
    return this.fcalculos.value[i];
  }

  ngOnDestroy() {
    this.subsloadurfs.unsubscribe();
    this.subsvaluechanges.unsubscribe();
  }

  public recalcula(menge: number, unit: string): number {
    // if (unit === null) {
    //   return null;
    // }
    // if (isUndefined(unit)) {
    //   return null;
    // }
    const u = this.urfs.filter((x) => x.un === unit);
    // if (isUndefined(u)) {
    //   return null;
    // }
    // if (u.length === 0) {
    //   return null;
    // }
    return menge * u[0].cuantos;
  }
  addneue(valor: number) {
    const npos = this.fb.group({
      einheit: [this.data.artikel.cuni, Validators.required],
      menge: [valor]
    });
    this.fcalculos.push(npos);

    this.valores.push(valor);
  }

  public close() {
    this.dialogo.close({ grabar: false, valor: 0 });
  }
  public ok() {
    this.dialogo.close({ grabar: true, valor: this.total });
  }
}
