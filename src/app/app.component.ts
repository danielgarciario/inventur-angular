import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { LoginState } from '../app/root-store/login-store/login.state';
import * as fromLoginActions from '../app/root-store/login-store/login.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'perminv-app';
  constructor(private store$: Store<LoginState>) {}

  ngOnInit() {
    console.log('Arrancando....');
    // this.store$.dispatch(
    //  LoginStoreActions.Trylogin({ username: 'dg.rio', password: 'blabla' })
    // );
    this.store$.dispatch(fromLoginActions.Trytoken());
  }
}
