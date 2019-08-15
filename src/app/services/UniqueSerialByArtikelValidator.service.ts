import { Injectable } from '@angular/core';
import {
  AsyncValidator,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppEstado } from 'src/app/root-store/root-store.state';
import * as fromSesionSelector from '../root-store/sessions-store/selectors';
import { map, concatMap, withLatestFrom } from 'rxjs/operators';
import { GezahltID } from 'src/app/models/Gezaehlt.model';

@Injectable({ providedIn: 'root' })
export class UniqueSerialByArtikelValidator implements AsyncValidator {
  constructor(private store$: Store<AppEstado>) {}

  testSiExiste(serl: string): Observable<boolean> {
    return this.store$.pipe(
      select(fromSesionSelector.DamePosiciones),
      concatMap((p) =>
        of(p).pipe(
          withLatestFrom(
            this.store$.pipe(select(fromSesionSelector.DameSelectedPosition))
          )
        )
      ),
      map(([p, s]) => {
        if (serl.length === 0) {
          return false;
        }
        const op = p.filter((x) => x.artikel.artikelnr === s.artikel.artikelnr);
        if (op.length === 0) {
          return false;
        }
        const sr = op.map((x) => x.gezahlt);
        const plano: Array<GezahltID> = [].concat(...sr);
        if (plano.length === 0) {
          return false;
        }
        const planofiltro = plano.filter((x) => x.serl === serl);
        console.log(`Validation Serial: ${planofiltro.length >= 1}`);
        return planofiltro.length >= 1;
      })
    );
  }

  validate(ctrl: AbstractControl): Observable<ValidationErrors | null> {
    return this.testSiExiste(ctrl.value).pipe(
      map((s) => (s ? { idNummerSchonBenutzt: true } : null))
    );
  }
}
