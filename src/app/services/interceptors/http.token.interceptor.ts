import { Injectable } from '@angular/core';
import { JwtService } from '../jwt.service';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { isUndefined } from 'util';

@Injectable({ providedIn: 'root' })
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headersConfig = {
      'Content-Type': 'aplication/json',
      Accept: 'application/json'
    };

    const token = this.jwtService.getToken();

    if (!isUndefined(token)) {
      // tslint:disable-next-line: no-string-literal
      headersConfig['Authorization'] = `${token}`;
    }
    const request = req.clone({ setHeaders: headersConfig });
    // console.log('Pasado Autorizacion');
    return next.handle(request);
  }
}
