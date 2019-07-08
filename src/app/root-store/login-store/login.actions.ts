import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

export const Trylogin = createAction(
  '[Login Page] trylogin',
  props<{ username: string; password: string }>()
);

export const Loginsuccess = createAction(
  '[Login Page] login success',
  props<{ usuario: User }>()
);

export const LoginfromTokensuccess = createAction(
  '[Login Page] login succes from token',
  props<{ usuario: User }>()
);

export const Loginfail = createAction(
  '[Login Page] login failed',
  props<{ error: any }>()
);

export const Trytoken = createAction('[Login Page] trytoken');
export const TokenTryFailed = createAction('[Login Page] trytoken failed');
export const Logout = createAction('[Login Page] Logout');
