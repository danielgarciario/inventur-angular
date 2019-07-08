import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { JwtService } from './jwt.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected baseURL = environment.apiURL;

  constructor(protected http: HttpClient, protected jwtService: JwtService) {}

  protected formatErrors(error: any) {
    console.log(error.error);
    return throwError(error.error);
  }

  get(
    path: string,
    parametros: HttpParams = new HttpParams()
  ): Observable<any> {
    return this.http
      .get(`${this.baseURL}${path}`, { params: parametros })
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: object = {}): Observable<any> {
    return this.http
      .put(`${this.baseURL}${path}`, JSON.stringify(body))
      .pipe(catchError(this.formatErrors));
  }

  post(path: string, body: object = {}): Observable<any> {
    return this.http
      .post(`${this.baseURL}${path}`, JSON.stringify(body))
      .pipe(catchError(this.formatErrors));
  }

  delete(path): Observable<any> {
    return this.http
      .delete(`${this.baseURL}${path}`)
      .pipe(catchError(this.formatErrors));
  }
}
