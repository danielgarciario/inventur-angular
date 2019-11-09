import { Injectable } from '@angular/core';
import { SessionsService } from '../sessions.service';
import { Store } from '@ngrx/store';
import { AppEstado } from 'src/app/root-store/root-store.state';
import * as fromSesionSelectors from '../../root-store/sessions-store/selectors';
import { ValidadorTipo } from 'src/app/helpers-module/Validador/VadlidadorTipo.model';
import { FormControl } from '@angular/forms';
import { Observable, of, Subject, BehaviorSubject, merge } from 'rxjs';
import { Sesion, LagerSesion } from 'src/app/models/sesion.model';
import {
  map,
  switchMap,
  debounceTime,
  filter,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { Artikel } from 'src/app/models/artikel.model';
import { Kandidato } from 'src/app/models/kandidato.model';

/* ESTO LO USO PARA BUSCAR ARTICULOS EN UNA NUEVA POSICION PARA LAS SESION */

@Injectable({ providedIn: 'root' })
export class SuchenArtikelFacade2Service {
  public vArtnum: ValidadorTipo<string>;
  public vBesch: ValidadorTipo<string>;
  public vLagerplatz: ValidadorTipo<string>;

  public sesion$: Observable<Sesion>;
  public lager$: Observable<LagerSesion>;
  public potenciales$: BehaviorSubject<Array<Artikel>>;
  public haypotenciales$: BehaviorSubject<{
    searching: boolean;
    nohaycandidatos: boolean;
    showtable: boolean;
  }>;
  public isSearchingPotenciales$: Observable<boolean>;
  public isSearchingKandidatos = false;
  public kandidatos$: BehaviorSubject<Array<Kandidato>>;
  public hayKandidatos$: Observable<boolean>;
  public LagerOhneLagerplatz$: Observable<boolean>;

  public buscaKandidatos: Subject<{ articulo: Artikel; lagerplatz: string }>;
  private mibuscaKandidato: Observable<{
    articulo: Artikel;
    lagerplatz: string;
  }>;
  private buscalagerplatz: Observable<{
    articulo: Artikel;
    lagerplatz: string;
  }>;

  constructor(private sesserv: SessionsService, store$: Store<AppEstado>) {
    this.vArtnum = new ValidadorTipo<string>(new FormControl(''));
    this.vLagerplatz = new ValidadorTipo<string>(new FormControl(''));

    this.sesion$ = store$.select(fromSesionSelectors.DameSelectedSession);
    this.lager$ = this.sesion$.pipe(map((s) => s.lager));
    this.LagerOhneLagerplatz$ = this.sesion$.pipe(
      map((s) => !s.lager.mitlagerplatz)
    );

    this.buscaKandidatos = new Subject<{
      articulo: Artikel;
      lagerplatz: string;
    }>();
    this.potenciales$ = new BehaviorSubject<Array<Artikel>>(
      new Array<Artikel>()
    );
    this.kandidatos$ = new BehaviorSubject<Array<Kandidato>>(
      new Array<Kandidato>()
    );
    this.haypotenciales$ = new BehaviorSubject<{
      searching: boolean;
      nohaycandidatos: boolean;
      showtable: boolean;
    }>({ searching: false, nohaycandidatos: false, showtable: false });

    this.isSearchingPotenciales$ = this.vArtnum.valueChanges$.pipe(
      debounceTime(700),
      switchMap((e) => {
        if (e.length < 2) {
          this.potenciales$.next(new Array<Artikel>());
          this.haypotenciales$.next({
            searching: false,
            nohaycandidatos: false,
            showtable: false
          });
          console.log('No hay nada que buscar');
          return of(false);
        }
        console.log('Voy a buscarlo');
        this.haypotenciales$.next({
          searching: true,
          nohaycandidatos: false,
          showtable: false
        });
        return sesserv.getArtikelPotencials(e.toUpperCase()).pipe(
          map((p) => {
            console.log(`Encontrados ${p.length}`);
            if (p.length === 1) {
              this.buscaKandidatos.next({ articulo: p[0], lagerplatz: null });
            }
            this.potenciales$.next(p);
            this.haypotenciales$.next({
              searching: false,
              nohaycandidatos: p === undefined || p.length === 0,
              showtable: p.length > 1
            });
            console.log(`devuelve ${p.length > 1}`);
            return p.length > 1;
          })
        );
      })
    );
    this.buscalagerplatz = this.vLagerplatz.valueChanges$.pipe(
      debounceTime(700),
      filter((e) => e.length > 1),
      map((e) => ({ lagerplatz: e.toUpperCase(), articulo: null }))
    );

    this.mibuscaKandidato = merge(this.buscaKandidatos, this.buscalagerplatz);
    this.hayKandidatos$ = this.mibuscaKandidato.pipe(
      withLatestFrom(this.sesion$),
      switchMap(([v, s]) => {
        console.log('Entrando en candidatos...');
        if (v.articulo !== null) {
          this.isSearchingKandidatos = true;
          return this.sesserv
            .getKandidatosFromArtikel(v.articulo.artikelnr, s.lager.cwar)
            .pipe(
              tap(() => (this.isSearchingKandidatos = false)),
              map((k) => {
                this.kandidatos$.next(k);
                return k.length > 0;
              })
            );
        }

        if (v.lagerplatz !== null) {
          this.isSearchingKandidatos = true;
          return this.sesserv
            .getKandidatosFromLagerOrt(s.lager.cwar, v.lagerplatz)
            .pipe(
              tap(() => (this.isSearchingKandidatos = false)),
              map((k) => {
                this.kandidatos$.next(k);
                return k.length > 0;
              })
            );
        }
        this.kandidatos$.next(new Array<Kandidato>());
        return of(false);
      })
    );
  }

  onSelectedPotencial(cual: Artikel) {
    this.buscaKandidatos.next({ articulo: cual, lagerplatz: null });
  }
}
