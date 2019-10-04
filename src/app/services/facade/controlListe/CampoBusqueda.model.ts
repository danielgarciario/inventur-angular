import { FormControl } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { startWith, debounceTime, map } from 'rxjs/operators';

export interface TipoCampoBusqueda<V> {
  nombrecampo: string;
  valuechanges$: Observable<{ campo: string; valor: any }>;
  value: any;
  filtro: (entrada: V, filtro: any) => boolean;
  iniciofiltro: (entrada: any) => boolean;
}

export class CampoBusqueda<V, T> implements TipoCampoBusqueda<V> {
  formulario: FormControl;
  valuechanges$: Observable<{ campo: string; valor: any }>;
  filtro: (entrada: V, filtrado: T) => boolean;
  iniciofiltro: (entrada: any) => boolean;

  constructor(public nombrecampo: string) {
    this.formulario = new FormControl('');
    this.valuechanges$ = this.formulario.valueChanges.pipe(
      map((v) => ({ campo: nombrecampo, valor: v })),
      debounceTime(750),
      startWith({ campo: nombrecampo, valor: '' })
    );
  }
  public get valor(): T {
    return this.formulario.value;
  }
  public get value(): any {
    return this.formulario.value;
  }
}

export class ConjuntoCampos<V> {
  public cambios$: Observable<Array<{ campo: string; valor: any }>>;
  public filtrados$: Observable<Array<V>>;
  public encontrados$: Observable<Array<V>>;

  constructor(
    public data$: Observable<Array<V>>,
    public campos: Array<TipoCampoBusqueda<V>>
  ) {
    this.cambios$ = combineLatest(campos.map((x) => x.valuechanges$));

    this.filtrados$ = combineLatest(data$, this.cambios$).pipe(
      map(([d, cam]) => {
        let data = [...d];
        for (const fil of cam) {
          const campo = this.getCampo(fil.campo);
          if (campo.iniciofiltro(fil.valor)) {
            data = data.filter((v) => campo.filtro(v, fil.valor));
          }
        }
        return data;
      })
    );
    this.encontrados$ = combineLatest(data$, this.cambios$).pipe(
      map(([d, cam]) => {
        const cambios = cam.filter((c) => {
          const campo = this.getCampo(c.campo);
          return campo.iniciofiltro(c.valor);
        });
        if (cambios.length === 0) {
          return new Array<V>();
        }
        let data = [...d];
        for (const cambio of cambios) {
          const cf = this.getCampo(cambio.campo);
          data = data.filter((v) => cf.filtro(v, cf.value));
        }
        return data;
      })
    );
  }

  getCampo(cual: string): TipoCampoBusqueda<V> {
    const f = this.campos.filter((x) => x.nombrecampo === cual);
    if (f.length === 0) {
      return null;
    }
    return f[0];
  }
}
