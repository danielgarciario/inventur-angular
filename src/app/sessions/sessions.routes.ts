import { Routes } from '@angular/router';
import { HomeLayoutComponent } from '../layouts/home-layout/home-layout.component';
import { HomeComponent } from './components/home/home.component';
import { SesionComponent } from './components/sesion/sesion.component';
import { NeuePositionComponent } from './components/neueposition/neueposition.component';
import { AuthGuard } from '../services/auth.guard';

export const sessionsRoutes: Routes = [
  {
    path: 'sessions',
    component: HomeLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'sessions',
        pathMatch: 'full'
      },
      { path: 'sessions', component: HomeComponent },
      { path: 'session/:id', component: SesionComponent },
      { path: 'neueposition/:id', component: NeuePositionComponent }
    ]
  }
];
