import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SesionPos } from 'src/app/models/sespos.model';
import { BestandID, Bestand } from 'src/app/models/bestand.model';

@Component({
  selector: 'app-position-bestand-part',
  templateUrl: './posbestandpart.component.html',
  styleUrls: ['./posbestandpart.component.scss']
})
export class PosicionBestandPartComponent {
  @Input() posicion: SesionPos;
  @Output() add2gezahlt = new EventEmitter<BestandID>();

  constructor() {}
  get bestandMasiv(): Bestand {
    if (this.posicion.artikel.seri === 1) {
      return null;
    }
    if (this.posicion.bestand.length === 0) {
      return null;
    }
    return this.posicion.bestand[0];
  }
}
