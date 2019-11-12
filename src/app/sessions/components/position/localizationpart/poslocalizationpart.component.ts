import { Component, Input, OnInit } from '@angular/core';
import { LagerOrt, Localizador } from 'src/app/models/lagerort.model';
import { SessionsService } from 'src/app/services/sessions.service';
import { ILagerOrtDatenBank } from 'src/app/models/lagerstrukt.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-posicion-localizacion-part',
  templateUrl: './poslocalizacionpart.component.html',
  styleUrls: ['./poslocalizacionpart.component.scss']
})
export class PosicionLocalizacionPartComponent implements OnInit {
  @Input() localizador: Localizador;
  lagerort$: Observable<ILagerOrtDatenBank>;

  constructor(private sservice: SessionsService) {}
  ngOnInit() {
    this.lagerort$ = this.sservice.resuelveLocalizador(this.localizador);
  }
}
