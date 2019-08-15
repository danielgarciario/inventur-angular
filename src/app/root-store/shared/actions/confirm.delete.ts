import { Action } from '@ngrx/store';
import { createAction, props } from '@ngrx/store';

export const confirmDeleteAction = createAction(
  '[Shared] Confirm Delete',
  props<{
    cancel?: Action;
    delete: Action;
    text: string;
    title: string;
  }>()
);
