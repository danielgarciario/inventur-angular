import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import {
  LoginStoreSelectors,
  RootStoreState,
  LoginStoreActions
} from '../../root-store';
import { select, Store } from '@ngrx/store';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { User } from './../../models/user.model';
import { LoginState } from './../../root-store/login-store/login.state';
import * as fromSelectors from './../../root-store/login-store/login.selectors';
import { AppEstado } from './../../root-store/root-store.state';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css']
})
export class HomeLayoutComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  isHandset$: Observable<boolean>;
  user$: Observable<User>;
  constructor(
    // private store$: Store<LoginState>,
    private store$: Store<AppEstado>,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    /*  this.isLoggedIn$ = this.store$.pipe(
      select(LoginStoreSelectors.loginIsAuthenticated)
    );
    this.user$ = this.store$.pipe(select(LoginStoreSelectors.loginUsuario)); */
    this.isHandset$ = this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map((result) => result.matches));
    this.isLoggedIn$ = this.store$.select(fromSelectors.loginIsAuthenticated);
    this.user$ = this.store$.select(fromSelectors.loginUsuario);
  }

  onLogout() {
    this.store$.dispatch(LoginStoreActions.Logout());
  }
}
