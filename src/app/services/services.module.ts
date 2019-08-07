import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpTokenInterceptor } from './interceptors/http.token.interceptor';

import { ApiService } from './api.service';
import { LoginApiService } from './login.api.service';
import { JwtService } from './jwt.service';
import { LoginService } from './login.service';
import { AuthGuard } from './auth.guard';
import { ExcelService } from './excel.service';
import {
  SumBestandOnHandPipe,
  SumGezahltPipe,
  Moment2ExcelPipe
} from '../sessions/components/sesion/sumbestand.pipe';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    ApiService,
    LoginService,
    JwtService,
    LoginApiService,
    AuthGuard,
    DatePipe,
    SumBestandOnHandPipe,
    SumGezahltPipe,
    Moment2ExcelPipe,
    ExcelService
  ]
})
export class ServicesModule {}
