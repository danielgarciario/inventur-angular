import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RootStoreState } from '../root-store';
import { LoginState } from '../root-store/login-store/login.state';
import { Store, select } from '@ngrx/store';
import * as fromLoginActions from '../root-store/login-store/login.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  private formSubmitAttempt: boolean;

  constructor(private fb: FormBuilder, private store$: Store<LoginState>) {}

  ngOnInit() {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onSubmit() {
    if (this.form.valid) {
      // this.authservice.login(this.form.value);
      /*
      this.loginService.intentaLogin(
        this.form.get('userName').value,
        this.form.get('password').value
      );
      */
      this.store$.dispatch(
        fromLoginActions.Trylogin({
          username: this.form.get('userName').value,
          password: this.form.get('password').value
        })
      );
    }
    this.formSubmitAttempt = true;
  }
}
