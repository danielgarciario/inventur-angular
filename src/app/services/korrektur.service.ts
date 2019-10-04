import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { KorrekturMasiv, KorrekturID } from '../models/korrektur.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KorrekturService {
  protected baseURL = environment.apiURL;
  protected lagerquery = 'S36';

  private uSesions = `${this.baseURL}/api/Sesions`;
  private uArtikel = `${this.baseURL}/api/Artikel`;
  private uBeowach = `${this.baseURL}/api/Beowachtungsliste`;
  private uKorrektur = `${this.baseURL}/api/Korrektur`;

  private pLager = `lager=${this.lagerquery}`;

  constructor(protected http: HttpClient) {}

  getKorrPosMasiv(): Observable<Array<KorrekturMasiv>> {
    const q = `${this.uKorrektur}/getKorrekMasivPosicion?${this.pLager}`;
    return this.http.get<Array<KorrekturMasiv>>(q);
  }

  getKorrPosId(): Observable<Array<KorrekturID>> {
    const q = `${this.uKorrektur}/getKorrekIDPosicion?${this.pLager}`;
    return this.http.get<Array<KorrekturID>>(q);
  }
}
