import { FormControl } from '@angular/forms';
import { OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of, Subscription } from 'rxjs';
import {
  switchMap,
  map,
  filter,
  distinctUntilChanged,
  expand,
  tap
} from 'rxjs/operators';
import { TipoValidador } from './TipoValidador.interface';
import { ValidadorInterface } from './ValidadorInterface.model';

export class Validador implements ValidadorInterface {
  errores$: Observable<Array<string>>;
  hayerrores$: Observable<boolean>;
  hayalgoqueborrar$: Observable<boolean>;
  valueChanges$: Observable<any>;

  // private errores = new BehaviorSubject<Array<string>>(new Array<string>());
  // private subsvaluechanges: Subscription;
  constructor(
    public formulario: FormControl,
    public validadores?: Array<TipoValidador>
  ) {
    if (validadores === undefined) {
      this.validadores = new Array<TipoValidador>();
    }
    // this.errores$ = this.errores.asObservable();
    this.valueChanges$ = formulario.valueChanges;
    this.errores$ = formulario.valueChanges.pipe(
      distinctUntilChanged(),
      map((v) => this.pasavalidadores(v))
    );
    this.hayerrores$ = formulario.valueChanges.pipe(
      map((v) => this.pasavalidadores(v)),
      map((e) => e.length > 0),
      distinctUntilChanged()
    );

    this.hayalgoqueborrar$ = formulario.valueChanges.pipe(
      distinctUntilChanged(),
      map((v) => {
        if (v === null) {
          return false;
        }
        if (v === undefined) {
          return false;
        }
        return (v + '').length > 0;
      })
    );
  }

  public unSubscribe() {
    //  this.subsvaluechanges.unsubscribe();
  }

  public get tieneErrores(): boolean {
    const e = this.pasavalidadores(this.formulario.value);
    return e.length > 0;
  }

  private pasavalidadores(v: any): Array<string> {
    const salida = new Array<string>();
    if (this.validadores.length === 0) {
      return salida;
    }
    for (const vali of this.validadores) {
      if (!vali.reglaIstOK(v)) {
        salida.push(vali.mensaje);
      }
    }
    return salida;
  }
}
