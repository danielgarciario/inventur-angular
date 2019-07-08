import { MatSnackBarConfig } from '@angular/material';
import { createAction, props } from '@ngrx/store';

export const SnackbarOpen = createAction(
  '[Snackbar] Open',
  props<{ mensaje: string; action?: string; config?: MatSnackBarConfig }>()
);
export const SnackbarClose = createAction('[Snackbar] Close');
