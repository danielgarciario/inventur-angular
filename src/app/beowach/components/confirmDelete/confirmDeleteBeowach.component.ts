import { OnInit, OnDestroy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-beo-delete-confirm-dialog',
  templateUrl: './confirmDeleteBeowach.component.html',
  styleUrls: ['./confirmDeleteBeowach.component.css']
})
export class ConfirmDeletebeowachComponent implements OnInit, OnDestroy {
  isSuccesfullygelöscht: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      text: string;
      delete?: Observable<string>;
    },
    private mdDialogRef: MatDialogRef<ConfirmDeletebeowachComponent>,
    private snackBar: MatSnackBar
  ) {
    this.isSuccesfullygelöscht = false;
  }

  public close() {
    this.mdDialogRef.close(this.isSuccesfullygelöscht);
  }

  public onDelete() {
    if (this.data.delete !== undefined) {
      const subs = this.data.delete
        .pipe(
          tap((x) => {
            this.isSuccesfullygelöscht = true;
            if (x !== undefined) {
              this.isSuccesfullygelöscht = !(x.length > 0);
            }
            console.log(`Borrado Ok: ${this.isSuccesfullygelöscht}`);
          })
        )
        .subscribe((sal) => {
          const mensaje = !this.isSuccesfullygelöscht
            ? sal
            : `${this.data.title} gelöscht`;
          this.snackBar.open(mensaje, null, { duration: 5000 });
          subs.unsubscribe();
          this.close();
        });
    } else {
      this.isSuccesfullygelöscht = true;
      this.close();
    }
  }

  ngOnInit() {}
  ngOnDestroy() {}
}
