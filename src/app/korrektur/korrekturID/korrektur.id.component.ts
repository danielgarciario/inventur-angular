import { Component, OnInit } from '@angular/core';
import { KorrekturFacadeService } from 'src/app/services/facade/korrektur.facade.service';
import { KorrekturID } from 'src/app/models/korrektur.model';
import { Observable } from 'rxjs';
import { Paginador } from 'src/app/helpers-module/paginador/paginador.component';

@Component({
  selector: 'app-korrektur-liste-ids',
  templateUrl: './korrektur.id.component.html',
  styleUrls: ['./korrektur.id.component.css']
})
export class KorrekturIDListeComponent implements OnInit {
  losID$: Observable<Array<KorrekturID>>;
  isLoading$: Observable<boolean>;
  mipaginador: Paginador<KorrekturID>;

  constructor(public kor: KorrekturFacadeService) {
    this.losID$ = kor.posID;
    this.isLoading$ = kor.isLoadingposID;
  }

  ngOnInit() {
    this.mipaginador = new Paginador<KorrekturID>(this.losID$);
  }
}
