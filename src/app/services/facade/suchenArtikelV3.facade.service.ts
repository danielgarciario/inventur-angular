import { Injectable } from '@angular/core';
import { SessionsService } from '../sessions.service';
import { ValidadorTipo } from 'src/app/helpers-module/Validador/VadlidadorTipo.model';
import { Store } from '@ngrx/store';
import * as fromSesionSelectors from '../../root-store/sessions-store/selectors';
import { AppEstado } from 'src/app/root-store/root-store.state';
import { FormControl } from '@angular/forms';
import {
  Observable,
  BehaviorSubject,
  of,
  ObservableLike,
  combineLatest
} from 'rxjs';
import { Sesion, LagerSesion } from 'src/app/models/sesion.model';
import {
  map,
  switchMap,
  debounceTime,
  withLatestFrom,
  combineAll,
  tap
} from 'rxjs/operators';
import {
  LagerStruct,
  ILagerOrtDatenBank
} from 'src/app/models/lagerstrukt.model';
import { Artikel } from 'src/app/models/artikel.model';
import { Kandidato } from 'src/app/models/kandidato.model';

@Injectable({ providedIn: 'root' })
export class SuchenArtikelFacadeV3Service {
  public vArtnum: ValidadorTipo<string>; // <-- Entrada de Nr de Articulo
  public vLagerplatz: ValidadorTipo<string>; // <-- Entrada de LagerPLatz

  public sesion$: Observable<Sesion>; // <-- Guardo la sesion
  public lager$: Observable<LagerSesion>; // <-- Guardo el LagerSesion (lo uso solamente para el Lager)
  public lagerMitLagerplatz$: Observable<boolean>; // <-- Para indicar que no hay Lagerplatz
  public lagerstruct$: Observable<LagerStruct>; // <-- Estructura del Lager de trabajo.

  // potenciales$ almacena los articulos cuando hay muchos para elegir...
  public potenciales$ = new BehaviorSubject<{
    searching: boolean;
    showtable: boolean;
    vacio: boolean;
    potenciales: Array<Artikel>;
  }>({
    searching: false,
    showtable: false,
    vacio: false,
    potenciales: new Array<Artikel>()
  });
  // searchingpotenciales$ tienes que subscribirte para que funcione la busqueda
  // de potenciales en este codigo.
  public searchingpotenciales$: Observable<boolean>;
  // ort$ almacena los articulos cuando hay que buscarlos...
  public ort$ = new BehaviorSubject<{
    searching: boolean;
    showtable: boolean;
    vacio: boolean;
    lugares: Array<ILagerOrtDatenBank>;
  }>({
    searching: false,
    showtable: false,
    vacio: false,
    lugares: new Array<ILagerOrtDatenBank>()
  });
  public searchingort$: Observable<boolean>;

  // kandidato$ almacena los Articulos + Localizador.
  public kandidato$ = new BehaviorSubject<{
    articulo: Artikel;
    lagerot: ILagerOrtDatenBank;
  }>({ articulo: null, lagerot: null });

  public kandidatoCompleto$: Observable<boolean>; // <-- Observable para saber si el candidato tiene todo.

  constructor(private sesserv: SessionsService, store$: Store<AppEstado>) {
    this.vArtnum = new ValidadorTipo<string>(new FormControl(''));
    this.vLagerplatz = new ValidadorTipo<string>(new FormControl(''));
    this.sesion$ = store$.select(fromSesionSelectors.DameSelectedSession);
    this.lager$ = this.sesion$.pipe(map((s) => s.lager));
    this.lagerstruct$ = this.sesion$.pipe(
      map((s) => {
        if (s == null) {
          return '';
        }
        return s.lager.cwar == null ? '' : s.lager.cwar;
      }),
      tap((l) => {
        if (this.kandidato$.value.lagerot != null) {
          if (this.kandidato$.value.lagerot.cwar !== l) {
            this.kandidato$.next({ ...this.kandidato$.value, lagerot: null });
            this.vLagerplatz.formulario.setValue('', { emitEvent: false });
          }
        }
      }),
      switchMap((l) => sesserv.getLager(l))
    );
    this.lagerMitLagerplatz$ = this.lagerstruct$.pipe(
      map((l) => {
        const istnichtleer = l.lagerplatze != null && l.lagerplatze.length > 0;
        if (!istnichtleer) {
          this.kandidato$.next({ articulo: null, lagerot: l });
        }
        return istnichtleer;
      })
    );
    this.kandidatoCompleto$ = combineLatest(
      this.kandidato$,
      this.lagerMitLagerplatz$
    ).pipe(
      map(([k, ls]) => {
        if (k.articulo == null) {
          return false;
        }
        if (!ls) {
          return true;
        }
        if (k.lagerot == null) {
          return false;
        }
        return true;
      })
    );
    // this.kandidatoCompleto$ = this.kandidato$.pipe(
    //   withLatestFrom(this.lagerOhneLagerplatz$),
    //   map(([k, l]) => {
    //     if (k.articulo == null) {
    //       return false;
    //     }
    //     if (l) {
    //       return true;
    //     }
    //     if (k.lagerot == null) {
    //       return false;
    //     }
    //     return true;
    //   })
    // );

    this.searchingpotenciales$ = this.vArtnum.valueChanges$.pipe(
      debounceTime(700),
      switchMap((e) => {
        if (e.length < 2) {
          this.potenciales$.next({
            searching: false,
            showtable: false,
            vacio: false,
            potenciales: new Array<Artikel>()
          });
          console.log('Nada que buscar');
          return of(false);
        }
        console.log(`voy a buscar el articulo ${e}`);
        this.potenciales$.next({
          ...this.potenciales$.value,
          searching: true,
          showtable: false
        });
        this.kandidato$.next({ ...this.kandidato$.value, articulo: null });
        return sesserv.getArtikelPotencials(e.toUpperCase()).pipe(
          map((p) => {
            console.log(`Encontrados ${p.length}`);
            this.potenciales$.next({
              searching: false,
              showtable: p.length > 1,
              vacio: p == null || p.length === 0,
              potenciales: p
            });
            if (p.length === 1) {
              const ns = { ...this.kandidato$.value, articulo: p[0] };
              console.log('Emitiendo nuevo Kandidato:', ns);
              this.kandidato$.next(ns);
            }
            return p.length > 1;
          })
        );
      })
    );

    this.searchingort$ = this.vLagerplatz.valueChanges$.pipe(
      debounceTime(700),
      switchMap((e) => {
        if (e.length < 2) {
          this.ort$.next({
            searching: false,
            showtable: false,
            vacio: false,
            lugares: new Array<ILagerOrtDatenBank>()
          });
          console.log('Ningun lugar que buscar');
          return of(false);
        }
        console.log(`voy a buscar Lort ${e}`);
        this.ort$.next({
          ...this.ort$.value,
          searching: true,
          showtable: false
        });
        this.kandidato$.next({ ...this.kandidato$.value, lagerot: null });
        return this.getOrtSuchen(e).pipe(
          map((l) => {
            console.log(`encontrados ${l.length}`);
            this.ort$.next({
              searching: false,
              showtable: l.length > 1,
              vacio: l == null || l.length === 0,
              lugares: l
            });
            if (l.length === 1) {
              const ns = { ...this.kandidato$.value, lagerot: l[0] };
              this.vLagerplatz.formulario.setValue(l[0].descripcion, {
                emitEvent: false
              });
              console.log('Emitiendo nuevo Kandidato:', ns);
              this.kandidato$.next(ns);
            }
            return l.length > 1;
          })
        );
      })
    );
  }

  onSelectedPotencial(cual: Artikel) {
    this.kandidato$.next({ ...this.kandidato$.value, articulo: cual });
  }
  onSelectedOrt(cual: ILagerOrtDatenBank) {
    this.kandidato$.next({ ...this.kandidato$.value, lagerot: cual });
    this.vLagerplatz.formulario.setValue(cual.descripcion, {
      emitEvent: false
    });
    this.ort$.next({ ...this.ort$.value, showtable: false });
  }

  private getLagerortbyReference(
    entrada: string
  ): Observable<Array<ILagerOrtDatenBank>> {
    return this.lagerstruct$.pipe(
      map((x) => {
        if (!x.hasLagerPLatze) {
          return new Array<ILagerOrtDatenBank>();
        }
        return this.getReferenceRecusive(x, entrada);
      })
    );
  }
  private getLagerortbyDescripcion(
    entrada: string
  ): Observable<Array<ILagerOrtDatenBank>> {
    return this.lagerstruct$.pipe(
      map((x) => {
        if (!x.hasLagerPLatze) {
          return new Array<ILagerOrtDatenBank>();
        }
        return this.getDescripcionRecursive(x, entrada);
      })
    );
  }

  private getOrtSuchen(entrada: string): Observable<Array<ILagerOrtDatenBank>> {
    return this.lagerstruct$.pipe(
      map((x) => {
        if (x.lagerplatze.length === 0) {
          return new Array<ILagerOrtDatenBank>();
        }
        const r = this.getReferenceRecusive(x, entrada);
        const d = this.getDescripcionRecursive(x, entrada);
        const s1 = [...r];
        const s2 = s1.concat([...d]);
        return [...new Set(s2)];
      })
    );
  }

  private getReferenceRecusive(
    donde: ILagerOrtDatenBank,
    que: string
  ): Array<ILagerOrtDatenBank> {
    let salida: Array<ILagerOrtDatenBank> = new Array<ILagerOrtDatenBank>();

    if (donde.hijos != null && donde.hijos.length > 0) {
      for (const hijo of donde.hijos) {
        const datos = this.getReferenceRecusive(hijo, que);
        if (datos.length > 0) {
          salida = salida.concat(...datos);
        }
      }
    }
    if (donde.referencia.toUpperCase().includes(que.toUpperCase())) {
      salida.push(donde);
    }
    return salida;
  }
  private getDescripcionRecursive(
    donde: ILagerOrtDatenBank,
    que: string
  ): Array<ILagerOrtDatenBank> {
    let salida: Array<ILagerOrtDatenBank> = new Array<ILagerOrtDatenBank>();
    if (donde.hijos != null && donde.hijos.length > 0) {
      for (const hijo of donde.hijos) {
        const datos = this.getDescripcionRecursive(hijo, que);
        if (datos.length > 0) {
          salida = salida.concat(...datos);
        }
      }
    }
    if (donde.descripcion.toUpperCase().includes(que.toUpperCase())) {
      salida.push(donde);
    }
    return salida;
  }
}
