import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private tokenaddres = environment.tokenaddress;

  getToken(): string {
    return window.localStorage[this.tokenaddres];
  }

  saveToken(token: string) {
    window.localStorage[this.tokenaddres] = token;
  }

  destroyToken() {
    console.log(`Destroy Token!!`);
    window.localStorage.removeItem(this.tokenaddres);
  }
}
