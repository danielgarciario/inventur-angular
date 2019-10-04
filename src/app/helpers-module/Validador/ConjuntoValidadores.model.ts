import { ValidadorTipo, ValidadorTipoInterface } from './VadlidadorTipo.model';
import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

export class ConjuntoValidadoresTipo {
  private pconjuntoconerrores$: Observable<boolean>;
  private pconjuntoCambios$: Observable<boolean>;
  private pconjuntoDisabled$: Observable<boolean>;

  public get conjuntoconerrores$() {
    return this.pconjuntoconerrores$;
  }
  public get conjuntoconcambios$() {
    return this.pconjuntoCambios$;
  }
  public get conjuntodisabled() {
    return this.pconjuntoDisabled$;
  }

  constructor(public campos: Array<ValidadorTipoInterface>) {
    this.pconjuntoCambios$ = combineLatest(
      campos.map((x) => x.cambiaElValor$)
    ).pipe(map((c) => c.reduce((a, v) => a || v, false)));
    this.pconjuntoconerrores$ = combineLatest(
      campos.map((x) => x.hayerrores$)
    ).pipe(map((c) => c.reduce((a, v) => a || v, false)));
    this.pconjuntoDisabled$ = combineLatest(
      this.pconjuntoCambios$,
      this.pconjuntoconerrores$
    ).pipe(
      map(([c, e]) => {
        return e ? true : !c;
      })
    );
  }
}
