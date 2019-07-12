import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppMaterialModule } from './app-material/app-material.module';
import { RootStoreModule } from './root-store/root-store.module';
import { environment } from 'src/environments/environment';
import { ServicesModule } from './services/services.module';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
// import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LoginDetailComponent } from './login/login-detail.component';
import { LayoutModule } from '@angular/cdk/layout';
// import { HomeIndexComponent } from './home/home-index.component';
// import { SesionComponent } from './sesion/sesion.component';
import { SessionsModule } from './sessions/sessions.module';

@NgModule({
  declarations: [
    AppComponent,
    // HomeComponent,
    //  HomeIndexComponent,
    LoginComponent,
    LoginDetailComponent,
    HomeLayoutComponent,
    LoginLayoutComponent
    // SesionComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RootStoreModule,
    AppRoutingModule,
    ServicesModule,
    AppMaterialModule,
    SessionsModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
