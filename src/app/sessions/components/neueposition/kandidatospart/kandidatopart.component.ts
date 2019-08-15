import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Observable, Subscription, timer, of } from 'rxjs';
import { Sesion } from 'src/app/models/sesion.model';
import { Artikel } from 'src/app/models/artikel.model';
import { Store, select } from '@ngrx/store';
import * as fromSelectors from '../../../../root-store/sessions-store/selectors';
import * as fromActions from '../../../../root-store/sessions-store/actions';
import { FormControl, FormGroup } from '@angular/forms';
import {
  distinctUntilChanged,
  filter,
  debounce,
  withLatestFrom,
  map,
  concatMap
} from 'rxjs/operators';
import { Kandidato } from 'src/app/models/kandidato.model';
import { AppEstado } from 'src/app/root-store/root-store.state';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-kandidatopart-detail',
  templateUrl: './kandidatopart.component.html',
  styleUrls: ['./kandidatopart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KandidatoPartComponent implements OnInit, OnDestroy {
  kandidatos$: Observable<Array<Kandidato>>;
  isloadingkandidatos$: Observable<boolean>;
  subsnavigate: Subscription;

  constructor(
    private store$: Store<AppEstado>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.kandidatos$ = this.store$.select(fromSelectors.DameKandidatos);
    this.isloadingkandidatos$ = this.store$.select(
      fromSelectors.isLoadingKandidatos
    );
    this.subsnavigate = this.store$
      .select(fromSelectors.DameSesPosicionCreateSuccess)
      .pipe(
        filter((r) => r),
        concatMap((r) =>
          of(r).pipe(
            withLatestFrom(
              this.store$.pipe(select(fromSelectors.DameSelectedPosition))
            )
          )
        ),
        map(([r, nsp]) => {
          if (r) {
            return nsp;
          }
        })
      )
      .subscribe((nsp) => {
        console.log('Hemos anadido una nueva posicion');
        console.log(nsp);
        this.store$.dispatch(fromActions.AddSesionPosSuccessAcknowledge());
        this.router.navigate(['../../position', nsp.idsespos], {
          relativeTo: this.route
        });
      });
  }

  ngOnDestroy() {
    this.subsnavigate.unsubscribe();
  }

  selectkandidato(kand: Kandidato) {
    this.store$.dispatch(
      fromActions.seleccionaCandidato({ selectKandidato: kand })
    );
  }
}
