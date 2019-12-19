import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { AppEstado } from 'src/app/root-store/root-store.state';
import { SessionsService } from 'src/app/services/sessions.service';
import { Observable, Subscription } from 'rxjs';
import { Lager } from 'src/app/models/lager.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as fromLoginSelectors from '../../../root-store/login-store/login.selectors';
import * as fromSesionActions from '../../../root-store/sessions-store/actions';
import { User } from 'src/app/models/user.model';
import { InventurDef } from 'src/app/models/inventurdef.model';
import { LagerStruct } from 'src/app/models/lagerstrukt.model';

@Component({
  selector: 'app-dialog-createsesion',
  templateUrl: './createsesion.dialog.component.html',
  styleUrls: ['./createsesion.dialog.component.scss']
})
export class DialogCreateSesionComponent implements OnInit, OnDestroy {
  lagers$: Observable<Array<LagerStruct>>;
  inventario$: Observable<Array<InventurDef>>;
  nsesion: FormGroup;
  subuser: Subscription;
  subinventario: Subscription;
  usuario: User;
  inventario: Array<InventurDef>;
  nohayinventario: boolean;

  constructor(
    public dialogo: MatDialogRef<DialogCreateSesionComponent>,
    private store$: Store<AppEstado>,
    private sesionservice: SessionsService
  ) {}

  ngOnDestroy() {
    this.subuser.unsubscribe();
    this.subinventario.unsubscribe();
  }
  ngOnInit() {
    this.lagers$ = this.sesionservice.getLagerStructur();
    this.inventario$ = this.sesionservice.getInventurDef();
    this.subinventario = this.inventario$.subscribe((s) => {
      this.inventario = s;
      this.nohayinventario = this.inventario.length === 0;
      // if (!this.nohayinventario) {
      //   this.nsesion.addControl('idinventario', new FormControl(''));
      //   this.nsesion.get('idinvetario').setValue(this.inventario[0]);
      // }
    });
    this.subuser = this.store$
      .select(fromLoginSelectors.loginUsuario)
      .subscribe((u) => (this.usuario = u));

    this.nsesion = new FormGroup({
      lager: new FormControl('', {
        validators: [Validators.required]
      }),
      comment: new FormControl(),
      idinventario: new FormControl(1, {
        validators: [Validators.required]
      })
    });
  }
  public ok() {
    const parametros = {
      empno: this.usuario.emno,
      lager: this.lager.value,
      comment: this.comment.value
    };
    // console.log(parametros);
    this.store$.dispatch(fromSesionActions.CrearSesion(parametros));
  }

  public creaInventario() {
    if (this.nohayinventario) {
      return;
    }
    const parametros = {
      empno: this.usuario.emno,
      lager: this.lager.value,
      comment: this.comment.value,
      idinventur: this.idinventario
    };
    this.store$.dispatch(fromSesionActions.CrearSesionInventur(parametros));
  }
  public close() {
    this.dialogo.close();
  }

  get lager() {
    return this.nsesion.get('lager');
  }
  get comment() {
    return this.nsesion.get('comment');
  }
  get idinventario(): number {
    return this.nsesion.get('idinventario').value;
  }
  set idinventario(cual: number) {
    this.nsesion.get('idinventario').setValue(cual);
  }
}
