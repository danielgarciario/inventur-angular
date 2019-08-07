import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoginStoreSelectors, RootStoreState } from '../root-store';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Sesion } from '../models/sesion.model';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { SesionPos } from '../models/sespos.model';
import { Kandidato } from '../models/kandidato.model';
import { Artikel } from '../models/artikel.model';

@Injectable({ providedIn: 'root' })
export class SessionsService {
  protected baseURL = environment.apiURL;
  private usuario$: Observable<User>;

  constructor(protected http: HttpClient) {
    // this.usuario$ = this.store$.pipe(select(LoginStoreSelectors.loginUsuario));
  }

  /* getSessions(): Observable<Array<Sesion>> {
    return this.usuario$.pipe(
      map(
        (usuario) =>
          `${this.baseURL}/api/Sesions/getSessions?empno=${usuario.emno}`
      ),
      switchMap((q) => this.http.get<Array<Sesion>>(q))
    );
  } */

  getSessions(emno: string): Observable<Array<Sesion>> {
    // console.log(`Dentro de getSessions para empleado ${emno}`);
    const q = `${this.baseURL}/api/Sesions/getSessions?empno=${emno}`;
    return this.http.get<Array<Sesion>>(q);
  }
  getOffenePositions(idsesion: number): Observable<Array<SesionPos>> {
    const q = `${
      this.baseURL
    }/api/Sesions/getAktiveSessionsPos?idsesion=${idsesion}`;
    // console.log(`[Servicios Cargando Posiciones] IdSesion: ${idsesion}`);
    return this.http.get<Array<SesionPos>>(q);
  }
  getKandidatosFromLagerOrt(
    cwar: string,
    loca: string
  ): Observable<Array<Kandidato>> {
    const q = `${
      this.baseURL
    }/api/Artikel/getArtikelByLagerplatz?lager=${cwar}&lagerplatz=${loca}`;
    return this.http.get<Array<Kandidato>>(q);
  }
  getArtikelPotencials(texto: string): Observable<Array<Artikel>> {
    const q = `${this.baseURL}/api/Artikel/getArtikel?busca=${texto}`;
    return this.http.get<Array<Artikel>>(q);
  }
  getKandidatosFromArtikel(
    item: string,
    cwar: string
  ): Observable<Array<Kandidato>> {
    const q = `${
      this.baseURL
    }/api/Artikel/getLagerPlatzByArtikel?lager=${cwar}&artikel=${item}`;
    return this.http.get<Array<Kandidato>>(q);
  }
  addSesionPosition(
    idsesion: number,
    artikelnr: string,
    loca: string
  ): Observable<SesionPos> {
    const q = `${
      this.baseURL
    }/api/Sesions/AddSesionPosition?idsesion=${idsesion}&artikel=${artikelnr}&loca=${loca}`;
    return this.http.get<SesionPos>(q);
  }
}
