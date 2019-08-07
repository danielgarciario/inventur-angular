import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import {
  distinctUntilChanged,
  debounce,
  merge,
  withLatestFrom,
  filter,
  map,
  switchMap
} from 'rxjs/operators';
import { Subscription, timer, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Sesion } from 'src/app/models/sesion.model';
import * as fromSelectors from '../../../root-store/sessions-store/selectors';
import * as fromActions from '../../../root-store/sessions-store/actions';
import { Kandidato } from 'src/app/models/kandidato.model';
import { LagerOrt } from 'src/app/models/lagerort.model';
import { Artikel } from 'src/app/models/artikel.model';
import { AppEstado } from 'src/app/root-store/root-store.state';

@Component({
  selector: 'app-form-item-loca',
  templateUrl: './formItemLoca.component.html',
  styleUrls: ['./formItemLoca.component.scss']
})
export class FormItemLocaComponent implements OnInit, OnDestroy {
  kandidatos$: Observable<Array<Kandidato>>;
  isloadingkandidatos$: Observable<boolean>;

  constructor(private store$: Store<AppEstado>) {}

  ngOnInit() {
    this.kandidatos$ = this.store$.select(fromSelectors.DameKandidatos);
    this.isloadingkandidatos$ = this.store$.select(
      fromSelectors.isLoadingKandidatos
    );
  }
  ngOnDestroy() {}
}
