import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import { Sesion } from 'src/app/models/sesion.model';
import { Artikel } from 'src/app/models/artikel.model';
import { Store } from '@ngrx/store';
import * as fromSelectors from '../../../../root-store/sessions-store/selectors';
import * as fromActions from '../../../../root-store/sessions-store/actions';
import { FormControl, FormGroup } from '@angular/forms';
import {
  distinctUntilChanged,
  filter,
  debounce,
  withLatestFrom
} from 'rxjs/operators';
import { Kandidato } from 'src/app/models/kandidato.model';
import { AppEstado } from 'src/app/root-store/root-store.state';

@Component({
  selector: 'app-kandidatopart-detail',
  templateUrl: './kandidatopart.component.html',
  styleUrls: ['./kandidatopart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KandidatoPartComponent implements OnInit, OnDestroy {
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

  selectkandidato(kand: Kandidato) {
    this.store$.dispatch(
      fromActions.seleccionaCandidato({ selectKandidato: kand })
    );
  }
}
