import { Component, OnInit } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  ParamMap,
  ActivatedRouteSnapshot
} from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Estado } from '../../../root-store/sessions-store/state';
import * as fromActions from '../../../root-store/sessions-store/actions';

@Component({
  selector: 'app-sesion',
  templateUrl: './sesion.component.html',
  styleUrls: ['./sesion.component.scss']
})
export class SesionComponent implements OnInit {
  snapshot: ActivatedRouteSnapshot;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store$: Store<Estado>
  ) {
    this.snapshot = route.snapshot;
  }

  ngOnInit() {
    const id = +this.snapshot.paramMap.get('id');
    console.log(`En SesionComponent para ID= ${id}`);
    /* Pedimos que se seleccione el ID que nos pasan */
    this.store$.dispatch(fromActions.SelectSesion({ selectedSesionId: id }));
  }
}
