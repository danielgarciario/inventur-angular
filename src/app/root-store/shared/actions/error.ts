import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { createAction, props } from '@ngrx/store';

export const HttpError = createAction(
  '[Http Error] Http Generic Error',
  props<{ status: number; mensaje: string }>()
);
