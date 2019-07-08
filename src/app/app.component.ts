import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RootStoreState, LoginStoreActions } from '../app/root-store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'perminv-app';
  constructor(private store$: Store<RootStoreState.Estado>) {}

  ngOnInit() {
    console.log('Arrancando....');
    // this.store$.dispatch(
    //  LoginStoreActions.Trylogin({ username: 'dg.rio', password: 'blabla' })
    // );
    this.store$.dispatch(LoginStoreActions.Trytoken());
  }
}
