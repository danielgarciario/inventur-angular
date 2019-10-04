import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { RootStoreState } from '../root-store';
import { LoginState } from '../root-store/login-store/login.state';
import { Store, select } from '@ngrx/store';
import * as fromLoginActions from '../root-store/login-store/login.actions';
import { Validador } from '../helpers-module/Validador/validador.model';
import { Observable, merge, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ValidadorNoEstaVacio } from '../helpers-module/Validador/DefineTipoValidador.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private formSubmitAttempt: boolean;

  userName: Validador;
  passWord: Validador;
  campos = new Array<Validador>();
  formconerrores: Observable<boolean>;

  constructor(private store$: Store<LoginState>) {}

  ngOnInit() {
    this.userName = new Validador(new FormControl(''), [ValidadorNoEstaVacio]);
    this.passWord = new Validador(new FormControl(''), [ValidadorNoEstaVacio]);

    this.formconerrores = combineLatest(
      this.userName.hayerrores$.pipe(startWith(this.userName.tieneErrores)),
      this.passWord.hayerrores$.pipe(startWith(this.passWord.tieneErrores))
    ).pipe(map(([u, p]) => u || p));
  }

  onSubmit() {
    this.store$.dispatch(
      fromLoginActions.Trylogin({
        username: this.userName.formulario.value,
        password: this.passWord.formulario.value
      })
    );

    this.formSubmitAttempt = true;
  }
}
