import {
  Component,
  ChangeDetectionStrategy,
  HostListener,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Action, Store } from '@ngrx/store';
import { AppEstado } from 'src/app/root-store/root-store.state';

/* Inspiracion:
https://brianflove.com/2017/07/17/angular-delete-confirmation/
*/

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.scss']
})
export class DeleteConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      cancel?: Action;
      delete: Action;
      go?: Action;
      text: string;
      title: string;
    },
    private mdDialogRef: MatDialogRef<DeleteConfirmDialogComponent>,
    private store: Store<AppEstado>
  ) {}

  public cancel() {
    if (this.data.cancel !== undefined) {
      this.store.dispatch(this.data.cancel);
    }
    this.close();
  }

  public close() {
    this.mdDialogRef.close();
  }
  public delete() {
    this.store.dispatch(this.data.delete);
    if (this.data.go !== undefined) {
      this.store.dispatch(this.data.go);
    }
    this.close();
  }
}
