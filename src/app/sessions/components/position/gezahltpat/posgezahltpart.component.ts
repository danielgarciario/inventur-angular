import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SesionPos } from 'src/app/models/sespos.model';
import { GezahltID } from 'src/app/models/Gezaehlt.model';

@Component({
  selector: 'app-position-gezahlt-part',
  templateUrl: './posgezahltpart.component.html',
  styleUrls: ['./posgezahltpart.component.scss']
})
export class PosicionGezahltPartComponent {
  @Input() posicion: SesionPos;
  @Output() resetgezahltID = new EventEmitter<GezahltID>();
  @Output() showDetailID = new EventEmitter<GezahltID>();
  @Output() DeletetgezahltID = new EventEmitter<GezahltID>();
  @Output() OnNeuGezhaltID = new EventEmitter();

  constructor() {}
}
