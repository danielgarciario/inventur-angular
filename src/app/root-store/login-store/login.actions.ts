import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { mergeNsAndName } from '@angular/compiler';

export const Trytoken = createAction('[Login Page] trytoken');

export const Trylogin = createAction(
  '[Login Page] trylogin',
  props<{ username: string; password: string }>()
);

export const Loginsuccess = createAction(
  '[Login Page] login success',
  props<{ usuario: User }>()
);

export const Loginfail = createAction(
  '[Login Page] login failed',
  props<{ status: number; mensaje: string }>()
);

export const LoginUnbekannt = createAction('[Login Page] Login unbekannt');

export const TokenTryFailed = createAction(
  '[Login Page] trytoken failed',
  props<{ status: number; mensaje: string }>()
);
export const Logout = createAction('[Login Page] Logout');
