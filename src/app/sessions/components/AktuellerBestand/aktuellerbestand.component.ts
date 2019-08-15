import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AktuellerBestand } from 'src/app/models/aktuellerBestand.model';
import { SessionsService } from 'src/app/services/sessions.service';

@Component({
  selector: 'app-sesion-aktueller-bestand',
  templateUrl: './aktuellerbestand.component.html',
  styleUrls: ['./aktuellerbestand.component.scss']
})
export class AktullerBestandComponent implements OnInit, OnDestroy {
  @Input() lager: string;
  @Input() artikel: string;
  aktubestand$: Observable<Array<AktuellerBestand>>;

  constructor(private sesserv: SessionsService) {}

  ngOnInit() {
    this.aktubestand$ = this.sesserv.getAktuellerBestand(
      this.lager,
      this.artikel
    );
  }
  ngOnDestroy() {}
}
