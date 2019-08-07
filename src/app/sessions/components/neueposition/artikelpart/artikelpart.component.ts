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
import { AppEstado } from 'src/app/root-store/root-store.state';

@Component({
  selector: 'app-artikelpart-detail',
  templateUrl: './artikelpart.component.html',
  styleUrls: ['./artikelpart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtikelPartComponent implements OnInit, OnDestroy {
  @Output() articulo: EventEmitter<Artikel> = new EventEmitter();

  subArtikel: Subscription;
  subsSelectedArtikel: Subscription;

  isloadingpotenciales$: Observable<boolean>;
  potenciales$: Observable<Array<Artikel>>;
  selectedArtikel$: Observable<Artikel>;

  artikelfc: FormControl;
  artikelForm: FormGroup;

  constructor(private store$: Store<AppEstado>) {
    this.artikelfc = new FormControl('');
    this.artikelForm = new FormGroup({ artikel: this.artikelfc });
  }

  ngOnInit() {
    this.potenciales$ = this.store$.select(fromSelectors.DamePotenciales);
    this.isloadingpotenciales$ = this.store$.select(
      fromSelectors.isLoadingPotenciales
    );
    this.selectedArtikel$ = this.store$.select(
      fromSelectors.DameSelectedPotencial
    );

    this.subArtikel = this.artikelfc.valueChanges
      .pipe(
        distinctUntilChanged(),
        filter((item: string) => item.length > 1),
        debounce(() => timer(500))
      )
      .subscribe((item) => {
        this.store$.dispatch(fromActions.buscaArticulos({ busqueda: item }));
      });

    this.subsSelectedArtikel = this.selectedArtikel$.subscribe((sa) => {
      if (sa != null) {
        const artnum = sa.artikelnr.trim();
        this.artikelfc.patchValue(artnum);
        this.articulo.emit(sa);
      }
    });
  }
  ngOnDestroy() {
    this.subArtikel.unsubscribe();
    this.subsSelectedArtikel.unsubscribe();
  }

  selectpotencial(pot: Artikel) {
    this.store$.dispatch(
      fromActions.seleccionaArticulo({ articuloseleccionado: pot })
    );
  }
}
