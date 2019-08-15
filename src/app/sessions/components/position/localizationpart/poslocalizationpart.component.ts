import { Component, Input } from '@angular/core';
import { LagerOrt } from 'src/app/models/lagerort.model';

@Component({
  selector: 'app-posicion-localizacion-part',
  templateUrl: './poslocalizacionpart.component.html',
  styleUrls: ['./poslocalizacionpart.component.scss']
})
export class PosicionLocalizacionPartComponent {
  @Input() lagerort: LagerOrt;

  constructor() {}
}
