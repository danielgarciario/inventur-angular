import { Observable } from 'rxjs';

export interface ValidadorInterface {
  errores$: Observable<Array<string>>;
  hayerrores$: Observable<boolean>;
  hayalgoqueborrar$: Observable<boolean>;
  valueChanges$: Observable<any>;

  tieneErrores: boolean;
}
