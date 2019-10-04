import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { SesionPos } from 'src/app/models/sespos.model';
import { GezahltID } from 'src/app/models/Gezaehlt.model';

import * as fromSesionActions from '../../../../../root-store/sessions-store/actions';
import { Store } from '@ngrx/store';
import { AppEstado } from 'src/app/root-store/root-store.state';
import { SesionStates } from 'src/app/models/sesionstatesenum.enum';

@Component({
  selector: 'app-pos-gezahltmitid',
  templateUrl: './posgezhaltmitid.component.html',
  styleUrls: ['./posgezhaltmitid.component.css']
})
export class PosGezahltMitIDComponent implements OnInit, OnDestroy {
  @Input() posicion: SesionPos;
  // @Output() OnNeuGezhaltID = new EventEmitter();
  // @Output() resetgezahltID = new EventEmitter<GezahltID>();
  // @Output() showDetailID = new EventEmitter<GezahltID>();
  // @Output() DeletetgezahltID = new EventEmitter<GezahltID>();

  ngOnInit() {}
  ngOnDestroy() {}

  constructor(private store$: Store<AppEstado>) {}

  onResetGezahltID(gez: GezahltID) {
    this.store$.dispatch(
      fromSesionActions.TryResetGezhaltID({
        gezahltId: gez
      })
    );
  }
  onShowGezhaltIDDetaill(gez: GezahltID) {
    this.store$.dispatch(
      fromSesionActions.ShowPosGezahlDetailID({
        sespos: this.posicion,
        gezhaltid: gez
      })
    );
  }
  onDeleteGezahltIDDetail(gez: GezahltID) {
    this.store$.dispatch(
      fromSesionActions.ConfirmDeleteGezahltID({
        posicion: this.posicion,
        gezahltId: gez
      })
    );
  }
  onNewGezhaltID() {
    let ngid: GezahltID;
    ngid = {
      idgezahlt: 0,
      serl: '',
      idsespos: this.posicion.idsespos,
      gezahlt: 1,
      comment: '',
      status: SesionStates.Abierto
    };
    this.store$.dispatch(
      fromSesionActions.ShowPosGezahlDetailID({
        sespos: this.posicion,
        gezhaltid: ngid
      })
    );
  }
  onChangedGezhalt(ngid: GezahltID) {
    const pos = { ...this.posicion };
    const gez = new Array<GezahltID>();
    gez.push(ngid);
    pos.gezahlt = gez;

    this.store$.dispatch(
      fromSesionActions.ChangePosGezhalDetailMasiv({
        npgezahlt: pos
      })
    );
  }
}
