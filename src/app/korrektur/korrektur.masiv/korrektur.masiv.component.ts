import { Component, OnInit } from '@angular/core';
import { KorrekturFacadeService } from 'src/app/services/facade/korrektur.facade.service';
import { Observable } from 'rxjs';
import { KorrekturMasiv } from 'src/app/models/korrektur.model';
import { Paginador } from 'src/app/helpers-module/paginador/paginador.component';

@Component({
  selector: 'app-korrektur-liste-masiv',
  templateUrl: './korrektur.masiv.component.html',
  styleUrls: ['./korrektur.masiv.component.css']
})
export class KorrekturMasivListeComponent implements OnInit {
  public masiv$: Observable<Array<KorrekturMasiv>>;
  public isLoading$: Observable<boolean>;
  public mipaginador: Paginador<KorrekturMasiv>;

  constructor(public kor: KorrekturFacadeService) {
    this.masiv$ = kor.posMasiv;
    this.isLoading$ = kor.isLoadingposMasiv;
  }

  ngOnInit() {
    this.mipaginador = new Paginador<KorrekturMasiv>(this.masiv$);
  }
}
