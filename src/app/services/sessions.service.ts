import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoginStoreSelectors, RootStoreState } from '../root-store';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Sesion } from '../models/sesion.model';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';

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
    console.log(`Dentro de getSessions para empleado ${emno}`);
    const q = `${this.baseURL}/api/Sesions/getSessions?empno=${emno}`;
    return this.http.get<Array<Sesion>>(q);
  }
}
