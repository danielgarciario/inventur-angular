import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { reducerlogin } from './login.reducer';
import { LoginStoreEffects } from './login.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('login', reducerlogin),
    EffectsModule.forFeature([LoginStoreEffects])
  ],
  providers: [LoginStoreEffects]
})
export class LoginStoreModule {}
