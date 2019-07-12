import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './services/auth.guard';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
// import { HomeComponent } from './home/home.component';
// import { SesionComponent } from './sesion/sesion.component';
import { LoginComponent } from './login/login.component';
import { AppMaterialModule } from './app-material/app-material.module';

/*
const routes: Routes = [
  {
    path: 'sessions',
    component: HomeLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'session/:id',
        component: SesionComponent
      },
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent
      }
    ]
  },
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  }

  { path: '**', redirectTo: '' }

];
*/

const routes: Routes = [
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: 'sessions',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: false }),
    AppMaterialModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
