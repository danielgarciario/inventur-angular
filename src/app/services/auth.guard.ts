import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { LoginState } from '../root-store/login-store/login.state';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as fromSelectors from '../root-store/login-store/login.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<LoginState>, private router: Router) {}
  /*
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.pipe(
      select(LoginStoreSelectors.loginIsAuthenticated),
      map((ili) => {
        if (!ili) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
*/
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.select(fromSelectors.loginIsAuthenticated).pipe(
      map((aut) => {
        if (!aut) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}
