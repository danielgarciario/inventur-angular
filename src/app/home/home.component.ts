import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromActions from '../root-store/sessions-store/actions';
import * as fromSelectors from '../root-store/sessions-store/selectors';
import { Estado } from '../root-store/sessions-store/state';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { Sesion } from '../models/sesion.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: ['home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private store$: Store<Estado>) {}

  loading: Observable<boolean>;
  sesiones: Observable<Array<Sesion>>;
  subssesions: Subscription;
  subloading: Subscription;

  ngOnInit(): void {
    console.log('Home Component');
    this.loading = this.store$.select(fromSelectors.isLoadingSessions);
    // console.log('Loading Cargado subscribiendose a loading');
    // this.subloading = this.loading.subscribe((l) => {
    //   console.log('Dentro Loading Session..');
    //   console.log(l);
    // });
    this.sesiones = this.store$.select(fromSelectors.getAllSessions);
    // console.log('Sesiones Cargado subscribiendose a sesiones');
    // this.subssesions = this.sesiones.subscribe((ses) => {
    //   console.log('Sesiones subscribe');
    //   console.log(ses);
    // });
    console.log('Dispatching action LoadSesions');

    this.store$.dispatch(fromActions.LoadSesions());
  }
}
