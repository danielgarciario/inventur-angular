import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoginStoreSelectors, RootStoreState } from '../root-store';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { Sesion } from '../models/sesion.model';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { SesionPos } from '../models/sespos.model';
import { Kandidato } from '../models/kandidato.model';
import { Artikel } from '../models/artikel.model';
import { AktuellerBestand } from '../models/aktuellerBestand.model';
import { Lager } from '../models/lager.model';
import { Urf } from '../models/urf.model';
import { InventurDef } from '../models/inventurdef.model';

@Injectable({ providedIn: 'root' })
export class SessionsService {
  protected baseURL = environment.apiURL;
  private usuario$: Observable<User>;

  constructor(protected http: HttpClient) {}

  private uSesions = `${this.baseURL}/api/Sesions`;
  private uArtikel = `${this.baseURL}/api/Artikel`;

  getSessions(emno: string): Observable<Array<Sesion>> {
    // console.log(`Dentro de getSessions para empleado ${emno}`);
    const q = `${this.uSesions}/getSessions?empno=${emno}`;
    return this.http.get<Array<Sesion>>(q);
  }
  // Por ahora lo tomamos del environment
  getlagers(): Observable<Array<Lager>> {
    const sal = new Array<Lager>(...environment.lagers);
    return of(sal);
  }
  getlager(cwar: string): Observable<Lager> {
    return this.getlagers().pipe(
      switchMap((ls) => ls.filter((x) => x.cwar === cwar))
    );
  }
  getInventurDef(): Observable<Array<InventurDef>> {
    const q = `${this.uSesions}/getInventurDef`;
    return this.http.get<Array<InventurDef>>(q);
  }

  createnewsesion(
    emno: string,
    lager: string,
    comment: string
  ): Observable<Sesion> {
    const q = `${
      this.uSesions
    }/createSesion?empno=${emno}&lager=${lager}&comment=${comment}`;
    return this.http.put<Sesion>(q, null);
  }
  createnewsesioninventario(
    emno: string,
    lager: string,
    idinventario: number,
    comment: string
  ): Observable<Sesion> {
    const q = `${
      this.uSesions
    }/createSesionInventario?empno=${emno}&lager=${lager}&idinventario=${idinventario}&comment=${comment}`;
    return this.http.put<Sesion>(q, null);
  }

  getOffenePositions(idsesion: number): Observable<Array<SesionPos>> {
    const q = `${this.uSesions}/getAktiveSessionsPos?idsesion=${idsesion}`;
    return this.http.get<Array<SesionPos>>(q);
  }
  getAktuellerBestand(
    lager: string,
    artikel: string
  ): Observable<Array<AktuellerBestand>> {
    const q = `${
      this.uSesions
    }/getAktuellerBestand?lager=${lager}&artikel=${artikel}`;
    return this.http.get<Array<AktuellerBestand>>(q);
  }
  getKandidatosFromLagerOrt(
    cwar: string,
    loca: string
  ): Observable<Array<Kandidato>> {
    const q = `${
      this.uArtikel
    }/getArtikelByLagerplatz?lager=${cwar}&lagerplatz=${loca}`;
    return this.http.get<Array<Kandidato>>(q);
  }
  getArtikelPotencials(texto: string): Observable<Array<Artikel>> {
    const q = `${this.uArtikel}/getArtikel?busca=${texto}`;
    return this.http.get<Array<Artikel>>(q);
  }
  getKandidatosFromArtikel(
    item: string,
    cwar: string
  ): Observable<Array<Kandidato>> {
    const q = `${
      this.uArtikel
    }/getLagerPlatzByArtikel?lager=${cwar}&artikel=${item}`;
    return this.http.get<Array<Kandidato>>(q);
  }
  addSesionPosition(
    idsesion: number,
    artikelnr: string,
    loca: string
  ): Observable<SesionPos> {
    const q = `${
      this.uSesions
    }/AddSesionPosition?idsesion=${idsesion}&artikel=${artikelnr}&loca=${loca}`;
    return this.http.get<SesionPos>(q);
  }
  deleteSesion(idsesion: number): Observable<boolean> {
    const q = `${this.uSesions}/deleteSesion?idsesion=${idsesion}`;
    return this.http.get<boolean>(q);
  }
  deleteSesionPosicion(
    idsesion: number,
    idposicion: number
  ): Observable<boolean> {
    const q = `${
      this.uSesions
    }/deletePosicion?idsesion=${idsesion}&idposicion=${idposicion}`;
    return this.http.get<boolean>(q);
  }
  deleteGezahltPosition(
    idposicion: number,
    idgezahl: number
  ): Observable<boolean> {
    const q = `${
      this.uSesions
    }/deleteGezahltPosition?idposicion=${idposicion}&idgezahl=${idgezahl}`;
    return this.http.get<boolean>(q);
  }
  addGezahltSesionPosition(
    idsesion: number,
    idposicion: number,
    gezahlt: number,
    comment: string,
    serl: string
  ): Observable<boolean> {
    const q = `${
      this.uSesions
    }/AddGezahltSesionPosition?idsesion=${idsesion}&idposicion=${idposicion}&gezahlt=${gezahlt}&comment=${comment}&serl=${serl}`;
    return this.http.get<boolean>(q);
  }
  modifyGezhaltSesionPosition(modSesPos: SesionPos): Observable<SesionPos> {
    const q = `${this.uSesions}/GezahtlSesionPositionAdd`;
    return this.http.put<SesionPos>(q, modSesPos);
  }

  getURF(artikelnr: string): Observable<Array<Urf>> {
    const q = `${this.uArtikel}/getURFs?artikel=${artikelnr}`;
    return this.http.get<Array<Urf>>(q);
  }
  getImagen(artikelnr: string): Observable<any> {
    const q = `${this.uArtikel}/getImagen?artikel=${artikelnr}`;
    return this.http.get<any>(q);
  }
}
