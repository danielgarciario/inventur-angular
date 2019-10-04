import { Injectable } from '@angular/core';
import { CargadoryCache } from './controlListe/Cargador.model';
import { KorrekturMasiv, KorrekturID } from 'src/app/models/korrektur.model';
import { KorrekturService } from '../korrektur.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KorrekturFacadeService {
  private masivpos: CargadoryCache<KorrekturMasiv>;
  private idpos: CargadoryCache<KorrekturID>;

  public posMasiv: Observable<Array<KorrekturMasiv>>;
  public posID: Observable<Array<KorrekturID>>;
  public isLoadingposMasiv: Observable<boolean>;
  public isLoadingposID: Observable<boolean>;

  constructor(private kor: KorrekturService) {
    this.generaCargadores();
    this.posMasiv = this.masivpos.data$;
    this.isLoadingposMasiv = this.masivpos.isLoading$;
    this.posID = this.idpos.data$;
    this.isLoadingposID = this.idpos.isLoading$;
  }

  private generaCargadores() {
    this.masivpos = new CargadoryCache<KorrekturMasiv>(
      this.kor.getKorrPosMasiv(),
      true
    );
    this.idpos = new CargadoryCache<KorrekturID>(this.kor.getKorrPosId(), true);
  }
}
