import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntradaTextoComponent } from './EntradaTexto/entrada-texto.component';
import { DialogKeyboardComponent } from './Teclados/DialogTeclado.component';
import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';
import { PaginadorComponent } from './paginador/paginador.component';

@NgModule({
  declarations: [
    DialogKeyboardComponent,
    EntradaTextoComponent,
    PaginadorComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [DialogKeyboardComponent, EntradaTextoComponent, PaginadorComponent],
  entryComponents: [DialogKeyboardComponent]
})
export class HelpersModule {}
