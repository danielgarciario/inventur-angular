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
import { AktuellerBestand } from '../models/aktuellerBestand.model';

@Injectable({ providedIn: 'root' })
export class SessionsService {
  protected baseURL = environment.apiURL;
  private usuario$: Observable<User>;

  constructor(protected http: HttpClient) {}

  private uSesions = `${this.baseURL}/api/Sesions`;
  private uArtikel = `${this.baseURL}/api/Artikel`;

  getSessions(emno: string): Observable<Array<Sesion>> {
    // console.log(`Dentro de getSessions para empleado ${emno}`);
    const q = `${this.baseURL}/api/Sesions/getSessions?empno=${emno}`;
    return this.http.get<Array<Sesion>>(q);
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
}
