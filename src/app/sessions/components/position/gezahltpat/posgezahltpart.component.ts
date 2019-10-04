import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy
} from '@angular/core';
import { SesionPos } from 'src/app/models/sespos.model';
import { GezahltID, Gezahlt } from 'src/app/models/Gezaehlt.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DialogURFComponent } from '../../urf/urf.dialog.component';
import { SesionStates } from 'src/app/models/sesionstatesenum.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-position-gezahlt-part',
  templateUrl: './posgezahltpart.component.html',
  styleUrls: ['./posgezahltpart.component.scss']
})
export class PosicionGezahltPartComponent implements OnInit, OnDestroy {
  @Input() posicion: SesionPos;
  @Output() resetgezahltID = new EventEmitter<GezahltID>();
  @Output() showDetailID = new EventEmitter<GezahltID>();
  @Output() DeletetgezahltID = new EventEmitter<GezahltID>();
  @Output() OnNeuGezhaltID = new EventEmitter();
  @Output() OnChangedGezahlt = new EventEmitter<GezahltID>();

  constructor(public dialogo: MatDialog) {}

  fgezmas: FormGroup;
  subsonchanges: Subscription;
  OnChangedGezahltEvent(ngid: GezahltID) {
    this.OnChangedGezahlt.emit(ngid);
  }

  ngOnInit() {
    this.fgezmas = new FormGroup({
      gezhalt: new FormControl(
        this.GezahltMasiv ? this.GezahltMasiv.gezahlt : '',
        { validators: [Validators.required, Validators.min(0)] }
      ),
      comment: new FormControl(
        this.GezahltMasiv ? this.GezahltMasiv.comment : ''
      )
    });
    this.subscribeOnchanges();
  }
  ngOnDestroy() {
    this.subsonchanges.unsubscribe();
  }

  subscribeOnchanges(): void {
    this.subsonchanges = this.fgezmas.valueChanges.subscribe((val) => {
      if (val.gezhalt === '') {
        return;
      }
      const valor: number = +val.gezhalt;
      const check1: boolean = valor >= 0;
      const check2: boolean = check1 && valor !== this.posvaluegezhalt();
      const check3: boolean =
        check1 && val.comment !== this.poscommentgezhalt();
      if (check2 || check3) {
        let ngid: GezahltID;
        ngid = {
          idgezahlt: this.posidgezhalt(),
          serl: '',
          idsespos: this.posicion.idsespos,
          gezahlt: valor,
          comment: val.comment,
          status: SesionStates.Abierto
        };
        this.OnChangedGezahlt.emit(ngid);
      }
    });
  }

  istposgezhalt(): boolean {
    return this.posicion.gezahlt.length > 0;
  }
  posvaluegezhalt(): number {
    if (!this.istposgezhalt()) {
      return -1;
    }
    return this.posicion.gezahlt[0].gezahlt;
  }
  poscommentgezhalt(): string {
    if (!this.istposgezhalt()) {
      return '';
    }
    return this.posicion.gezahlt[0].comment;
  }
  posidgezhalt(): number {
    if (!this.istposgezhalt()) {
      return 0;
    }
    return this.posicion.gezahlt[0].idgezahlt;
  }

  get GezahltMasiv(): Gezahlt {
    if (this.posicion.artikel.seri === 1) {
      return null;
    }
    if (this.posicion.gezahlt === null) {
      return null;
    }
    if (this.posicion.gezahlt.length === 0) {
      return null;
    }
    return this.posicion.gezahlt[0];
  }
  get fgezhalt() {
    return this.fgezmas.get('gezhalt');
  }

  onGetURF(): void {
    const midata = {
      artikel: this.posicion.artikel,
      origen: this.GezahltMasiv ? this.GezahltMasiv.gezahlt : 0
    };
    const dialogref = this.dialogo.open(DialogURFComponent, {
      data: midata
    });
    dialogref.afterClosed().subscribe((salida) => {
      if (salida.grabar) {
        this.fgezhalt.patchValue(salida.valor);
      }
    });
  }
}
