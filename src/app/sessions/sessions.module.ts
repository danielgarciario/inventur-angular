import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { sessionsRoutes } from './sessions.routes';
import { HomeComponent } from './components/home/home.component';
import { HomeIndexComponent } from './components/home/home-index.component';
import { SesionComponent } from './components/sesion/sesion.component';
import { AppMaterialModule } from '../app-material/app-material.module';

@NgModule({
  declarations: [HomeComponent, SesionComponent, HomeIndexComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(sessionsRoutes),
    AppMaterialModule
  ]
})
export class SessionsModule {}
