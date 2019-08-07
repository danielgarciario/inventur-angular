import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
    //    StoreModule.forFeature('login', reducerlogin),
    //   EffectsModule.forFeature([LoginStoreEffects])
    // StoreModule.forRoot({ login: reducerlogin }),
    // EffectsModule.forRoot([LoginStoreModule])
  ]
  // providers: [LoginStoreEffects]
})
export class LoginStoreModule {}
