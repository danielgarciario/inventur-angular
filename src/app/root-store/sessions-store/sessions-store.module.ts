import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducer';
import { SessionsStoreEffects } from './effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('sesion', reducer),
    EffectsModule.forFeature([SessionsStoreEffects])
  ],
  providers: [SessionsStoreEffects]
})
export class SessionsStoreModule {}
