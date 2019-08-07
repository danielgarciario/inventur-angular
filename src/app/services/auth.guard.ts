import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

// import { LoginState } from '../root-store/login-store/login.state';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import * as fromSelectors from '../root-store/login-store/login.selectors';
import { AppEstado } from '../root-store/root-store.state';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private store$: Store<AppEstado>, private router: Router) {}
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
    return this.store$.select(fromSelectors.loginIsAuthenticated).pipe(
      map((aut) => {
        if (!aut) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }),
      take(1) //
    );
  }
}
