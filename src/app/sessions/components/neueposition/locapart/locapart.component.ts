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
import { LagerOrt } from 'src/app/models/lagerort.model';
import { AppEstado } from 'src/app/root-store/root-store.state';

@Component({
  selector: 'app-locapart-detail',
  templateUrl: './locapart.component.html',
  styleUrls: ['./locapart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocaPartComponent implements OnInit, OnDestroy {
  sesion$: Observable<Sesion>;
  subLagerPlatz: Subscription;
  locafc: FormControl;
  locaForm: FormGroup;

  constructor(private store$: Store<AppEstado>) {
    this.locafc = new FormControl('');
    this.locaForm = new FormGroup({ loca: this.locafc });
  }
  ngOnInit() {
    this.sesion$ = this.store$.select(fromSelectors.DameSelectedSession);
    this.subLagerPlatz = this.locafc.valueChanges
      .pipe(
        distinctUntilChanged(),
        filter((loca: string) => loca.length > 2),
        debounce(() => timer(500)),
        withLatestFrom(this.sesion$)
      )
      .subscribe(([loca, sesion]) => {
        const lo: LagerOrt = { lager: sesion.lager, lagerplatz: loca };
        this.store$.dispatch(
          fromActions.BuscaCandidatosLagerOrt({ localizacion: lo })
        );
      });
  }
  ngOnDestroy() {
    this.subLagerPlatz.unsubscribe();
  }
}
