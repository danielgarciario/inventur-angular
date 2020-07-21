import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import {
  LoginStoreSelectors,
  RootStoreState,
  LoginStoreActions,
} from '../../root-store';
import { select, Store } from '@ngrx/store';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { User } from './../../models/user.model';
import { LoginState } from './../../root-store/login-store/login.state';
import * as fromSelectors from './../../root-store/login-store/login.selectors';
import { AppEstado } from './../../root-store/root-store.state';
import { MatSidenav } from '@angular/material';
import { environment, LagerDefinition } from 'src/environments/environment';
import { FormControl } from '@angular/forms';
import { BeowachtService } from 'src/app/services/beowacht.service';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css'],
})
export class HomeLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('drawer', { static: true })
  thedrawerref: MatSidenav;
  beowlagers: Array<LagerDefinition>;
  beolager: string;
  beocontrol: FormControl;
  isLoggedIn$: Observable<boolean>;
  isIPAD$: Observable<boolean>;
  user$: Observable<User>;
  istbeowacthunguser$: Observable<boolean>;
  subIsIpad: Subscription;
  IsIpad: boolean;
  constructor(
    // private store$: Store<LoginState>,
    private store$: Store<AppEstado>,
    private breakpointObserver: BreakpointObserver,
    private beoService: BeowachtService
  ) {
    this.beowlagers = environment.beowachlagers;
    this.beocontrol = new FormControl();
  }

  ngOnInit() {
    /*  this.isLoggedIn$ = this.store$.pipe(
      select(LoginStoreSelectors.loginIsAuthenticated)
    );
    this.user$ = this.store$.pipe(select(LoginStoreSelectors.loginUsuario)); */
    this.beocontrol.setValue(this.beoService.lagerquery());
    this.beocontrol.valueChanges.forEach((n) =>
      this.beoService.setlagerquery(n)
    );
    this.isIPAD$ = this.breakpointObserver
      .observe(Breakpoints.Tablet)
      .pipe(map((result) => result.matches));
    this.isLoggedIn$ = this.store$.select(fromSelectors.loginIsAuthenticated);
    this.user$ = this.store$.select(fromSelectors.loginUsuario);
    this.subIsIpad = this.isIPAD$.subscribe((ipad) => {
      this.IsIpad = ipad;
    });
    this.istbeowacthunguser$ = this.user$.pipe(
      map((u) => {
        const lista: Array<string> = environment.beousers;
        return lista.includes(u.emno);
      })
    );
  }

  onLogout() {
    this.store$.dispatch(LoginStoreActions.Logout());
  }
  /*
  (click)="drawer.toggle()"
   *ngIf="isIPAD$ | async"
  */
  tryToggle() {
    console.log(this.thedrawerref);
    this.thedrawerref.toggle();
  }
  selectLager(event: Event) {
    this.beolager = (event.target as HTMLSelectElement).value;
  }

  tryClose() {
    if (this.IsIpad) {
      this.thedrawerref.close();
    }
  }
  ngOnDestroy() {
    this.subIsIpad.unsubscribe();
  }
}
