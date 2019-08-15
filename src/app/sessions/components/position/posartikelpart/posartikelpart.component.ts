import { Component, Input } from '@angular/core';
import { Artikel } from 'src/app/models/artikel.model';

@Component({
  selector: 'app-posicion-artikel-part',
  templateUrl: './posartikelpart.component.html',
  styleUrls: ['./posartikelpart.component.scss']
})
export class PosicionArtikelPartComponent {
  @Input() artikel: Artikel;

  constructor() {}
}
