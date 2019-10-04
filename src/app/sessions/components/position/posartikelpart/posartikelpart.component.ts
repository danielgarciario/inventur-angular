import { Component, Input, OnInit } from '@angular/core';
import { Artikel } from 'src/app/models/artikel.model';
import { SessionsService } from 'src/app/services/sessions.service';

@Component({
  selector: 'app-posicion-artikel-part',
  templateUrl: './posartikelpart.component.html',
  styleUrls: ['./posartikelpart.component.scss']
})
export class PosicionArtikelPartComponent implements OnInit {
  @Input() artikel: Artikel;
  isLoadingImagen = true;
  noImagen = true;
  imagendata: any;

  constructor(private sesser: SessionsService) {}
  ngOnInit() {
    this.isLoadingImagen = true;
    this.sesser.getImagen(this.artikel.artikelnr).subscribe((p) => {
      this.imagendata = 'data:image/jpg;base64,' + p;
      this.isLoadingImagen = false;
      this.noImagen = p === null;
    });
  }
}
