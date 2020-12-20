import {
  OnDestroy,
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  AfterContentChecked,
} from '@angular/core';
import { SesionPos } from 'src/app/models/sespos.model';
import { MatDialog } from '@angular/material';
import { Validador } from 'src/app/helpers-module/Validador/validador.model';
import { FormControl } from '@angular/forms';
import { DialogURFComponent } from '../../../urf/urf.dialog.component';
import { Observable, combineLatest, EMPTY, Subscription } from 'rxjs';
import { startWith, map, switchMap, filter, tap } from 'rxjs/operators';
import { GezahltID } from 'src/app/models/Gezaehlt.model';
import { SesionStates } from 'src/app/models/sesionstatesenum.enum';
import { ValidadorMayorIgualQueCero } from 'src/app/helpers-module/Validador/DefineTipoValidador.model';

@Component({
  selector: 'app-pos-gezhaltmasiv',
  templateUrl: './posgezhaltmasiv.component.html',
  styleUrls: ['./posgezhaltmasiv.component.css'],
})
export class PosGezahltMasivComponent
  implements OnInit, OnDestroy, AfterContentChecked {
  @Input() posicion: SesionPos;
  @Output() OnChangedGezahlt = new EventEmitter<GezahltID>();
  @Output() OnMagicKey = new EventEmitter();

  gezhaltMasiv: Validador;
  comentarios: Validador;
  formconerrores$: Observable<boolean>;
  formcambiado$: Observable<GezahltID>;
  subformcambiados: Subscription;
  pedirfocus: boolean;

  constructor(public dialogo: MatDialog) {
    this.pedirfocus = false;
  }

  onGetURF(): void {
    const midata = {
      artikel: this.posicion.artikel,
      origen: this.gezhaltMasiv.formulario.value,
    };
    const dialref = this.dialogo.open(DialogURFComponent, {
      data: midata,
    });
    const subsdiaclose = dialref.afterClosed().subscribe((salida) => {
      if (salida.grabar) {
        this.gezhaltMasiv.formulario.setValue(salida.valor);
      }
      subsdiaclose.unsubscribe();
    });
  }

  onMagicKey() {
    console.log('Magic key!');
    this.OnMagicKey.emit();
  }

  ngOnInit() {
    let entrada = 0;
    let entradacomentarios = '';
    if (this.posicion.gezahlt !== null) {
      if (this.posicion.gezahlt !== undefined) {
        if (this.posicion.gezahlt.length > 0) {
          entrada = this.posicion.gezahlt[0].gezahlt;
          entradacomentarios = this.posicion.gezahlt[0].comment;
        }
      }
    }
    this.gezhaltMasiv = new Validador(new FormControl(entrada), [
      ValidadorMayorIgualQueCero,
    ]);
    this.comentarios = new Validador(new FormControl(entradacomentarios));
    this.formconerrores$ = this.gezhaltMasiv.hayerrores$.pipe(
      startWith(this.gezhaltMasiv.tieneErrores)
    );
    const cambiogezhalt$ = this.gezhaltMasiv.valueChanges$.pipe(
      map((tv: any) => +tv),
      filter((v: number) => !isNaN(v)),
      startWith(
        this.posicion.gezahlt.length === 0
          ? 0
          : this.posicion.gezahlt[0].gezahlt
      )
    );
    const cambiocomment$ = this.comentarios.valueChanges$.pipe(
      map((tv: any) => tv + ''),
      startWith(
        this.posicion.gezahlt.length === 0
          ? ''
          : this.posicion.gezahlt[0].comment
      )
    );
    const haycambios$ = combineLatest(cambiogezhalt$, cambiocomment$);

    const cambios$ = haycambios$.pipe(
      filter(([g, c]) => {
        let sal = false;
        const gez =
          this.posicion.gezahlt.length === 0
            ? 0
            : this.posicion.gezahlt[0].gezahlt;
        const com =
          this.posicion.gezahlt.length === 0
            ? ''
            : this.posicion.gezahlt[0].comment;
        sal = sal || gez !== g;
        sal = sal || com !== c;
        return sal;
      })
    );
    this.formcambiado$ = combineLatest(this.formconerrores$, cambios$).pipe(
      // filter(([e, [g, c]]) => !e),
      map(([e, [g, c]]) => {
        if (e) {
          return null;
        }
        let idgez = 0;
        if (this.posicion.gezahlt.length > 0) {
          idgez =
            this.posicion.gezahlt[0].idgezahlt === undefined
              ? 0
              : this.posicion.gezahlt[0].idgezahlt;
        }
        const ngid: GezahltID = {
          idgezahlt: idgez,
          serl: '',
          idsespos: this.posicion.idsespos,
          gezahlt: g,
          comment: c,
          status: SesionStates.Abierto,
        };
        return ngid;
      })
    );

    this.subformcambiados = this.formcambiado$.subscribe((ngid) => {
      console.log('Emiting neue Gezahlt:', ngid);
      this.OnChangedGezahlt.emit(ngid);
    });
  }

  ngAfterContentChecked(): void {
    this.pedirfocus = true;
  }

  ngOnDestroy() {
    this.subformcambiados.unsubscribe();
  }
}
