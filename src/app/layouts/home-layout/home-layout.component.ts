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
    private store$: Store<RootStoreState.Estado>,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.isLoggedIn$ = this.store$.pipe(
      select(LoginStoreSelectors.loginIsAuthenticated)
    );
    this.user$ = this.store$.pipe(select(LoginStoreSelectors.loginUsuario));
    this.isHandset$ = this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map((result) => result.matches));
  }

  onLogout() {
    this.store$.dispatch(LoginStoreActions.Logout());
  }
}
