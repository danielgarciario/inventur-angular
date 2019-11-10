import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMaterialModule } from '../app-material/app-material.module';

import { sessionsRoutes } from './sessions.routes';

import { HomeComponent } from './components/home/home.component';
import { HomeIndexComponent } from './components/home/home-index.component';
import { SesionComponent } from './components/sesion/sesion.component';
import { PosIndexComponent } from './components/sesion/pos-index.component';
import { NeuePositionComponent } from './components/neueposition/neueposition.component';
import { FormItemLocaComponent } from './components/neueposition/formItemLoca.component';
import { FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ArtikelPartComponent } from './components/neueposition/artikelpart/artikelpart.component';

import {
  SumBestandOnHandPipe,
  Moment2ExcelPipe,
  SumGezahltPipe
} from './components/sesion/sumbestand.pipe';
import { LocaPartComponent } from './components/neueposition/locapart/locapart.component';
import { KandidatoPartComponent } from './components/neueposition/kandidatospart/kandidatopart.component';
import { PositionComponent } from './components/position/position.component';
import { PosicionArtikelPartComponent } from './components/position/posartikelpart/posartikelpart.component';
import { PosicionLocalizacionPartComponent } from './components/position/localizationpart/poslocalizationpart.component';
import { PosicionBestandPartComponent } from './components/position/bestandspart/posbestandpart.component';
import { PosicionGezahltPartComponent } from './components/position/gezahltpat/posgezahltpart.component';
import { DialogPosicionGezhaltIDComponent } from './components/position/newgezhaltid/posnewgezid.dialog.component';
import { AktullerBestandComponent } from './components/AktuellerBestand/aktuellerbestand.component';
import { DialogCreateSesionComponent } from './components/createsesion/createsesion.dialog.component';
import { DialogURFComponent } from './components/urf/urf.dialog.component';
import { ShowStatusComponent } from './components/Status/status.component';
import { EntradaTextoComponent } from '../helpers-module/EntradaTexto/entrada-texto.component';
import { DialogKeyboardComponent } from '../helpers-module/Teclados/DialogTeclado.component';
import { HelpersModule } from '../helpers-module/helpers-module.module';
import { PosGezahltMitIDComponent } from './components/position/gezahltpat/gezhaltmitID/posgezhaltmitid.component';
import { PosGezahltMasivComponent } from './components/position/gezahltpat/gezahltmasiv/posgezhaltmasiv.component';
import { PartialArtikelComponent } from './components/neueposition/partartikel/partartikel.component';
import { PartialLagerOrtComponent } from './components/neueposition/partlagerort/partlagerort.component';

@NgModule({
  declarations: [
    HomeComponent,
    SesionComponent,
    HomeIndexComponent,
    PosIndexComponent,
    NeuePositionComponent,
    FormItemLocaComponent,
    ArtikelPartComponent,
    LocaPartComponent,
    KandidatoPartComponent,
    PositionComponent,
    PosicionArtikelPartComponent,
    PosicionLocalizacionPartComponent,
    PosicionBestandPartComponent,
    PosicionGezahltPartComponent,
    AktullerBestandComponent,
    DialogCreateSesionComponent,
    DialogPosicionGezhaltIDComponent,
    DialogURFComponent,
    ShowStatusComponent,
    PosGezahltMitIDComponent,
    PosGezahltMasivComponent,
    PartialArtikelComponent,
    PartialLagerOrtComponent,
    // EntradaTextoComponent,
    // DialogKeyboardComponent,

    SumBestandOnHandPipe,
    SumGezahltPipe,
    Moment2ExcelPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(sessionsRoutes),
    AppMaterialModule
  ],
  entryComponents: [
    DialogCreateSesionComponent,
    DialogPosicionGezhaltIDComponent,
    DialogURFComponent
    // DialogKeyboardComponent
  ]
})
export class SessionsModule {}
