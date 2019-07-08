import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtService } from './jwt.service';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginApiService extends ApiService {
  constructor(protected http: HttpClient, protected jwtService: JwtService) {
    super(http, jwtService);
  }
  getUser(): Observable<User> {
    return this.http
      .get<User>(`${this.baseURL}/api/User/getuser`)
      .pipe(catchError(this.formatErrors));
  }

  tryLogin(usuario: string, password: string): Observable<User> {
    const query = `${
      this.baseURL
    }/api/User/login?username=${usuario}&password=${password}`;
    return this.http.get<User>(query).pipe(catchError(this.formatErrors));
  }

  trythelogin(usuario: string, password: string): Observable<User> {
    const query = `${
      this.baseURL
    }/api/User/login?username=${usuario}&password=${password}`;
    return this.http.get<User>(query);
  }
  tryGetUser(): Observable<User> {
    return this.http.get<User>(`${this.baseURL}/api/User/getuser`);
  }
}
