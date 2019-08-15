import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SesionPos } from 'src/app/models/sespos.model';

@Component({
  selector: 'app-pos-index',
  templateUrl: 'pos-index.component.html',
  styleUrls: ['pos-index.component.scss']
})
export class PosIndexComponent {
  @Input() loading: boolean;
  @Input() posiciones: Array<SesionPos>;
  @Output() delete = new EventEmitter<SesionPos>();
  @Output() gotoPosition = new EventEmitter<SesionPos>();

  constructor() {}
}
