import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { EffectsModule } from '@ngrx/effects';
// import { StoreModule } from '@ngrx/store';
// import { reducerSessions } from './reducer';
// import { SessionsStoreEffects } from './effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
    //  StoreModule.forFeature('sesion', reducer),
    //  EffectsModule.forFeature([SessionsStoreEffects])
    // StoreModule.forRoot({ sesion: reducer }),
    // EffectsModule.forRoot([SessionsStoreEffects])
  ]
  // providers: [SessionsStoreEffects]
})
export class SessionsStoreModule {}
