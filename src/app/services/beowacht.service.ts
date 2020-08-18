import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BeowachtungsListe } from '../models/beowachliste.model';
import { LagerControl } from '../models/lagercontrol.model';
import {
  WocheVerbrauch,
  GrupoWocheVerbrauch,
  FdistribucionVerbrauch,
} from '../models/wochenverbrauch.model';
import { EndeWocheBestand } from '../models/endewochebestand.model';
import { LeadTime } from '../models/leadtime.model';
import { User } from 'src/app/models/user.model';
import * as fromLoginSelectors from 'src/app/root-store/login-store/login.selectors';
import * as fromSesionsActions from 'src/app/root-store/sessions-store/actions';
import { AppEstado } from '../root-store/root-store.state';
import { Store } from '@ngrx/store';
import { SessionsService } from './sessions.service';
import * as moment from 'moment';
import { map, catchError, tap } from 'rxjs/operators';
import * as fromSharedError from 'src/app/root-store/shared/actions/error';
import { Sesion } from '../models/sesion.model';
import { Kandidato } from '../models/kandidato.model';
import { SesionPos } from '../models/sespos.model';

@Injectable({ providedIn: 'root' })
export class BeowachtService {
  protected baseURL = environment.apiURL;
  // protected lagerquery = 'S36';

  private beolageraddress = environment.beolageraddress;
  private defaultbeolager = environment.beowachlager;
  private uSesions = `${this.baseURL}/api/Sesions`;
  private uArtikel = `${this.baseURL}/api/Artikel`;
  private uBeowach = `${this.baseURL}/api/Beowachtungsliste`;
  private pLager = `lager=${this.lagerquery()}`;

  constructor(
    protected http: HttpClient,
    private store$: Store<AppEstado>,
    private sesservice: SessionsService
  ) {}

  lagerquery(): string {
    const tt: string = window.localStorage[this.beolageraddress];
    if (tt) {
      return tt;
    }
    window.localStorage[this.beolageraddress] = this.defaultbeolager;
    return this.defaultbeolager;
  }
  setlagerquery(neulager: string) {
    window.localStorage[this.beolageraddress] = neulager;
  }

  getUser(): Observable<User> {
    return this.store$.select(fromLoginSelectors.loginUsuario);
  }
  crearSesion(empno: string, articulos: Array<string>): Observable<Sesion> {
    const ahora: moment.Moment = moment();
    const titulo = `Von Beobachtung ${ahora.format('D.MM.YYYY HH:mm')}`;
    const q = `${
      this.uSesions
    }/createbeobachtungsesion?empno=${empno}&cwar=${this.lagerquery()}&comment=${titulo}`;
    return this.http.put<Sesion>(q, articulos).pipe(
      tap((s) => {
        console.log('Creada Sesion id:', s.idSesion);
        this.store$.dispatch(
          fromSesionsActions.CrearSesionSuccess({ nuevasesion: s })
        );
      })
    );
  }
  getKandidatos(item: string): Observable<Array<Kandidato>> {
    console.log('Buscando item', item, ' en ', this.lagerquery);
    return this.miskandidatosFromArtikel(item);
  }
  private miskandidatosFromArtikel(item: string): Observable<Array<Kandidato>> {
    const q = `${this.uArtikel}/getLagerPlatzByArtikel?lager=${this.lagerquery}&artikel=${item}`;
    return this.http.get<Array<Kandidato>>(q);
  }

  addSesionPosition(
    idsesion: number,
    artikelnr: string,
    loca: string
  ): Observable<SesionPos> {
    return this.sesservice.addSesionPosition(idsesion, artikelnr, loca, '');
  }

  getBeowachtungsliste(): Observable<Array<BeowachtungsListe>> {
    const q = `${this.uBeowach}/getBeowachtungsListe?${this.pLager}`;
    return this.http.get<Array<BeowachtungsListe>>(q);
  }

  getLagerControl(): Observable<Array<LagerControl>> {
    const q = `${this.uBeowach}/getLagerControl?${this.pLager}`;
    return this.http.get<Array<LagerControl>>(q);
  }
  getKandidatosLagerControl(): Observable<Array<LagerControl>> {
    const q = `${this.uBeowach}/getBeowachtungsKandidate?${this.pLager}`;
    return this.http.get<Array<LagerControl>>(q);
  }
  getLagerControlItemLager(
    lager: string,
    item: string
  ): Observable<LagerControl> {
    const q = `${this.uBeowach}/getLAgerControlByLagerItem?lager=${lager}&item=${item}`;
    return this.http.get<LagerControl>(q);
  }
  getWochenVerbrauch(
    lager: string,
    item: string
  ): Observable<Array<WocheVerbrauch>> {
    const q = `${this.uBeowach}/getLagerWocheVerbrauch?lager=${lager}&item=${item}`;
    return this.http.get<Array<WocheVerbrauch>>(q);
  }
  getEndeWocheBestand(
    lager: string,
    item: string
  ): Observable<Array<EndeWocheBestand>> {
    const q = `${this.uBeowach}/getLagerEndeWocheBestand?lager=${lager}&item=${item}`;
    return this.http.get<Array<EndeWocheBestand>>(q);
  }
  getLeadTime(lager: string, item: string): Observable<LeadTime> {
    const q = `${this.uBeowach}/getLeadTime?lager=${lager}&item=${item}`;
    return this.http.get<LeadTime>(q);
  }
  deleteArtikelFromBeowachtungsliste(
    lager: string,
    item: string
  ): Observable<string> {
    const q = `${this.uBeowach}/DeleteArtikelFromControlListe?lager=${lager}&item=${item}`;
    return this.http.put<string>(q, null);
  }
  insertNewArtikelFromFesteLagerPlatz(
    lager: string,
    item: string
  ): Observable<string> {
    const q = `${this.uBeowach}/InsertNewArtikelFromFesteLagerPlatz?lager=${lager}&item=${item}`;
    return this.http.put<string>(q, null);
  }
  updateArtikelLagerPlatzMaxBestand(
    lager: string,
    item: string,
    alteloca: string,
    neueloca: string,
    altemaxbtnd: number,
    neuemaxbtnd: number
  ): Observable<string> {
    // tslint:disable-next-line: max-line-length
    const q = `${this.uBeowach}/UpdateArtikelLagerplatzAndMaxbestand?lager=${lager}&item=${item}&alteloca=${alteloca}&neueloca=${neueloca}&altemxbtnd=${altemaxbtnd}&neuemaxbtnd=${neuemaxbtnd}`;
    return this.http.put<string>(q, null);
  }
  updateArtikelMeldungAndMindestBestand(
    lager: string,
    item: string,
    neuemeldung: number,
    neuemindest: number
  ): Observable<string> {
    // tslint:disable-next-line: max-line-length
    const q = `${this.uBeowach}/UpdateArtikelMeldungAndMindestBestand?lager=${lager}&item=${item}&neuemeldung=${neuemeldung}&neuemidnest=${neuemindest}`;
    return this.http.put<string>(q, null);
  }

  private sumaparciales(
    consumo: Array<WocheVerbrauch>,
    indice: number,
    cuantos: number
  ): number {
    let salida = 0;
    for (let index = indice; index <= indice + cuantos - 1; index++) {
      salida += consumo[index].menge;
    }
    return salida;
  }
  private unicomenge(grupos: Array<GrupoWocheVerbrauch>): Array<number> {
    // tslint:disable-next-line: triple-equals
    if (grupos == undefined) {
      return null;
    }
    return [...new Set(grupos.map((x) => x.menge))].sort((n1, n2) => n1 - n2);
  }
  getFDistribucion(
    consumo: Array<WocheVerbrauch>,
    numsemanas: number
  ): Array<FdistribucionVerbrauch> {
    const grupos = this.agrupaVerbrauch(consumo, numsemanas);
    const salida = new Array<FdistribucionVerbrauch>();
    if (grupos == null) {
      return salida;
    }
    if (grupos.length === 0) {
      return salida;
    }
    const unicomenge = this.unicomenge(grupos);
    if (unicomenge == null) {
      return salida;
    }
    // console.log('unicos');
    // console.log(unicomenge);
    const cwar = grupos[0].cwar;
    const item = grupos[0].item;
    const cuni = grupos[0].cuni;
    let acum = 0;
    for (let index = 0; index < unicomenge.length; index++) {
      const cantidad = unicomenge[index];
      const cuantos = grupos.filter((x) => x.menge === cantidad).length;
      acum += cuantos;
      const tt: FdistribucionVerbrauch = {
        cwar,
        item,
        cuni,
        menge: cantidad,
        procent: acum,
      };
      salida.push(tt);
    }
    // console.log('acum Cuenta');
    // console.log(acum);
    if (acum > 0) {
      for (let i = 0; i < salida.length; i++) {
        salida[i].procent = (salida[i].procent * 100) / acum;
      }
    }
    return salida;
  }

  private agrupaVerbrauch(
    consumo: Array<WocheVerbrauch>,
    numsemanas: number
  ): Array<GrupoWocheVerbrauch> {
    if (consumo === undefined) {
      return null;
    }
    if (consumo.length === 0) {
      return null;
    }
    const sal = new Array<GrupoWocheVerbrauch>();
    const item = consumo[0].item;
    const lager = consumo[0].cwar;
    const cuni = consumo[0].cuni;
    if (consumo.length <= numsemanas) {
      let datounico: GrupoWocheVerbrauch;
      datounico = {
        cwar: lager,
        item,
        cuni,
        grupo: 0,
        menge: consumo.map((x) => x.menge).reduce((p, n) => p + n),
      };
      sal.push(datounico);
      return sal;
    }
    for (let index = 0; index <= consumo.length - numsemanas; index++) {
      const dato: GrupoWocheVerbrauch = {
        cwar: lager,
        item,
        cuni,
        grupo: index,
        menge: this.sumaparciales(consumo, index, numsemanas),
      };
      sal.push(dato);
    }
    return sal;
  }
}
