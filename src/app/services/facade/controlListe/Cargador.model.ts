import {
  Observable,
  BehaviorSubject,
  interval,
  Subject,
  timer,
  merge
} from 'rxjs';
import * as moment from 'moment';
import { shareReplay, tap, switchMap } from 'rxjs/operators';

const INTERVALO = 30 * 60 * 1000;

export class CargadoryCache<T> {
  /*
https://blog.thoughtram.io/angular/2018/03/05/advanced-caching-with-rxjs.html
*/

  isLoading$: Subject<boolean>;
  data$: Observable<Array<T>>;
  private misdatos: BehaviorSubject<Array<T>>;
  private reload: Subject<void>;
  private fReload: Observable<Array<T>>;
  private tReload: Observable<Array<T>>;
  private aReload: Observable<Array<T>>;

  constructor(private cargadorAPI: Observable<Array<T>>, timereload: boolean) {
    this.isLoading$ = new Subject<boolean>();
    this.reload = new Subject<void>();
    this.misdatos = new BehaviorSubject<Array<T>>(new Array<T>());
    this.data$ = this.misdatos.asObservable();
    this.fReload = this.reload.pipe(
      tap(() => this.isLoading$.next(true)),
      switchMap(() =>
        this.cargadorAPI.pipe(tap(() => this.isLoading$.next(false)))
      )
    );
    if (timereload) {
      const timer$ = timer(0, INTERVALO);
      this.tReload = timer$.pipe(
        tap(() => this.isLoading$.next(true)),
        switchMap(() =>
          this.cargadorAPI.pipe(tap(() => this.isLoading$.next(false)))
        )
      );
      this.aReload = merge(this.fReload, this.tReload);
    } else {
      this.aReload = this.fReload;
      this.recarga();
    }
    this.aReload.subscribe((d) => {
      this.misdatos.next(d);
    });
  }

  public recarga() {
    this.reload.next();
  }

  public addNewData(dato: T) {
    const datos = [...this.misdatos.value];
    datos.push(dato);
    this.misdatos.next(datos);
  }
  public deleteData(fbusqueda: (entrada: T) => boolean) {
    const datos = [...this.misdatos.value];
    const otros = datos.filter((x) => !fbusqueda(x));
    this.misdatos.next(otros);
  }
  public updateData(nuevodato: T, fbusquedaviejo: (entrada: T) => boolean) {
    const datos = [...this.misdatos.value];
    const otros = datos.filter((x) => !fbusquedaviejo(x));
    otros.push(nuevodato);
    this.misdatos.next(otros);
  }
}
