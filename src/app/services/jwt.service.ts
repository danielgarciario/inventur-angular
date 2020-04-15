import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { isUndefined } from 'util';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private tokenaddres = environment.tokenaddress;

  getToken(): string {
    return window.localStorage[this.tokenaddres];
  }

  saveToken(token: string) {
    if (isUndefined(token)) {
      return;
    }
    window.localStorage[this.tokenaddres] = token;
  }

  destroyToken() {
    console.log(`Destroy Token!!`);
    window.localStorage.removeItem(this.tokenaddres);
  }
}
