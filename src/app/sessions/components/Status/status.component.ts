import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SesionStates } from 'src/app/models/sesionstatesenum.enum';

@Component({
  selector: 'app-show-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowStatusComponent {
  @Input() Elstatus: number;

  constructor() {}

  istAbierto(): boolean {
    return this.checkstatus(SesionStates.Abierto);
  }
  istCerrado(): boolean {
    return this.checkstatus(SesionStates.Cerrado);
  }
  istInventario(): boolean {
    return this.checkstatus(SesionStates.Inventario);
  }

  checkstatus(contra: SesionStates): boolean {
    // tslint:disable-next-line: no-bitwise
    return (this.Elstatus & contra) === contra;
  }
}
