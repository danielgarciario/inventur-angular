import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Sesion } from '../../../models/sesion.model';

@Component({
  selector: 'app-sesion-index',

  templateUrl: './home-index.component.html',

  styleUrls: ['./home-index.component.scss']
})
export class HomeIndexComponent {
  @Output() delete = new EventEmitter<Sesion>();
  @Output() gotoSesion = new EventEmitter<Sesion>();

  @Input() loading: boolean;

  @Input() sesiones: Array<Sesion>;

  constructor() {}
}
