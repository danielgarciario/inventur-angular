import { Injectable } from '@angular/core';
import { LoginApiService } from './login.api.service';
import { JwtService } from './jwt.service';
import { User } from '../models/user.model';
import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { isUndefined } from 'util';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);

  public currentUser$ = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: LoginApiService,
    private jwtService: JwtService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // this.populate();
  }

  populate() {
    console.log('Probando a ver si existe el token');
    if (this.jwtService.getToken()) {
      this.apiService.getUser().subscribe(
        (user) => {
          this.guardaAutorizacion(user);
          this.router.navigate(['/']);
          return;
        },
        (err) => {
          console.log(`getting error ${err}`);
          this.borrarAutorizacion();
          return;
        }
      );
      return;
    }
    console.log('No existe el token');
    this.borrarAutorizacion();
  }

  guardaAutorizacion(usuario: User) {
    this.jwtService.saveToken(usuario.token);
    // console.log(usuario);
    this.currentUserSubject.next(usuario);
    this.isAuthenticatedSubject.next(true);
  }
  borrarAutorizacion() {
    this.jwtService.destroyToken();
    this.currentUserSubject.next({} as User);
    this.isAuthenticatedSubject.next(false);
  }
  intentaLogin(usuario: string, password: string) {
    console.log(`Trying Login in: ${usuario} `);
    return this.apiService.tryLogin(usuario, password).subscribe(
      (usrio) => {
        console.log('respuesta trylogin');
        console.log(usrio);
        if (usrio == null) {
          this.snackBar.open('Anwender und Passwort nicht bekant!!', null, {
            duration: 5000
          });
          return null;
        }
        this.guardaAutorizacion(usrio);
        this.router.navigate(['/']);
        return usrio;
      },
      (err) => {
        console.log(`getting error ${err}`);
        this.borrarAutorizacion();
      }
    );
  }

  trylogin(usuario: string, password: string): Observable<User> {
    return this.apiService.trythelogin(usuario, password);
  }
  tryToken(): Observable<User> {
    const tkn = this.jwtService.getToken();
    console.log(`Tengo Token: ${tkn}`);
    return this.apiService.tryGetUser();
  }

  deleteToken() {
    console.log('Borrando Token...');
    // this.jwtService.destroyToken();
  }
  saveTheToken(usuario: User) {
    if (isUndefined(usuario)) {
      return;
    }
    this.jwtService.saveToken(usuario.token);
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }
  logout() {
    this.borrarAutorizacion();
    this.router.navigate(['/login']);
  }
}
