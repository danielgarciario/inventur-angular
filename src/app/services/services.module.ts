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
import { UniqueSerialByArtikelValidator } from './UniqueSerialByArtikelValidator.service';
import { SuchenArtikelFacadeService } from './facade/suchenArtikel.facade.service';
import {
  SumBestandOnHandPipe,
  SumGezahltPipe,
  Moment2ExcelPipe
} from '../sessions/components/sesion/sumbestand.pipe';
import { BeowachtService } from './beowacht.service';
import { ControlListeFacadeService } from './facade/controlListe.facade.service';
import { KorrekturService } from './korrektur.service';
import { KorrekturFacadeService } from './facade/korrektur.facade.service';
import { SuchenArtikelFacade2Service } from './facade/suchenArtikelV2.facade.service';
import { SuchenArtikelFacadeV3Service } from './facade/suchenArtikelV3.facade.service';

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
    UniqueSerialByArtikelValidator,
    Moment2ExcelPipe,
    ExcelService,
    SuchenArtikelFacadeService, // <-- Creo que hay que quitarlo..
    SuchenArtikelFacade2Service, // <- Antiguo habra que quitarlo.
    SuchenArtikelFacadeV3Service,
    BeowachtService,
    ControlListeFacadeService,
    KorrekturService,
    KorrekturFacadeService
  ]
})
export class ServicesModule {}
