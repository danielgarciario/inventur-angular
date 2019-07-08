import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { LoginStoreSelectors, RootStoreState } from '../root-store';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store<RootStoreState.Estado>,
    private router: Router
  ) {}
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
    return this.store.select(LoginStoreSelectors.loginIsAuthenticated).pipe(
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
