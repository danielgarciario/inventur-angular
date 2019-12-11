import { Observable, ObservableLike, Subscription, combineLatest } from 'rxjs';
import { FormControl } from '@angular/forms';
import { TipoValidador } from './TipoValidador.interface';
import {
  map,
  filter,
  startWith,
  distinctUntilChanged,
  tap
} from 'rxjs/operators';

export interface ValidadorTipoInterface {
  errores$: Observable<Array<string>>;
  hayerrores$: Observable<boolean>;
  cambiaElValor$: Observable<boolean>;
}

export class ValidadorTipo<T> implements ValidadorTipoInterface {
  private cerrores$: Observable<Array<string>>;
  private chayerrores$: Observable<boolean>;
  private chayalgoqueborrar$: Observable<boolean>;
  private cvalueChanges$: Observable<T>;
  private cvalorChanges$: Observable<boolean>;

  public get errores$() {
    return this.cerrores$;
  }
  public get hayerrores$() {
    return this.chayerrores$.pipe(startWith(false));
  }
  public get hayalgoqueborrar$() {
    return this.chayalgoqueborrar$;
  }
  public get valueChanges$() {
    return this.cvalueChanges$;
  }
  public get cambiaElValor$() {
    return this.cvalorChanges$.pipe(startWith(false));
  }
  /* Aqui defino como comparar los valores */
  public funcSonIguales: (v: T, vi: T) => boolean;

  private mivalorincial$: Observable<T>;

  constructor(
    public formulario: FormControl,
    public validadores?: Array<TipoValidador>,
    public valorinicial?: Observable<T>
  ) {
    if (validadores === undefined) {
      this.validadores = new Array<TipoValidador>();
    }
    if (valorinicial !== undefined) {
      this.mivalorincial$ = this.valorinicial.pipe(
        tap((x) => this.formulario.setValue(x))
      );
    }

    /* */
    this.cvalueChanges$ = formulario.valueChanges.pipe(
      map((x) => {
        return x as T;
      })
    );
    // --- hay un valor distinto del inicial
    this.cvalorChanges$ =
      this.valorinicial === undefined
        ? this.cvalueChanges$.pipe(map((t) => true))
        : combineLatest(this.cvalueChanges$, this.mivalorincial$).pipe(
            map(([c, vi]) => {
              const salida: boolean = !this.funcSonIguales(c, vi);
              console.log(
                `Analizo Cambio con valorcambio: ${c}, valor inicial: ${vi} --> ${salida}`
              );
              return salida;
            }),
            tap((x) => console.log(`Cambio con ValorInicial ${x}`))
          );
    // --- Errores
    this.cerrores$ = this.cvalueChanges$.pipe(
      map((v) => this.pasavalidadores(v)),
      distinctUntilChanged()
    );
    this.chayerrores$ = this.cerrores$.pipe(
      map((ars) => ars.length > 0),
      distinctUntilChanged()
    );
  }
  // Valor directo de la validacion //.
  public get tieneErrores(): boolean {
    const e = this.pasavalidadores(this.formulario.value);
    return e.length > 0;
  }

  public reseteaValor() {
    this.formulario.setValue('', { emitEvent: false });
  }

  private pasavalidadores(v: T): Array<string> {
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

  unSubscribe() {
    // this.svi.unsubscribe();
  }
}
