import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import Keyboard from 'simple-keyboard';
import { Validador } from '../Validador/validador.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dialog-showteclado',
  templateUrl: './DialogTeclado.component.html',
  styleUrls: ['./DialogTeclado.component.css']
})
export class DialogKeyboardComponent implements OnInit, OnDestroy {
  teclado: Keyboard;
  private german = {
    default: [
      '^ 1 2 3 4 5 6 7 8 9 0 ß ´ {bksp}',
      '{tab} q w e r t z u i o p ü +',
      '{lock} a s d f g h j k l ö ä # {enter}',
      '{shift} < y x c v b n m , . - {shift}',
      '.com @ {space} {cierra}'
    ],
    shift: [
      '° ! " § $ % & / ( ) = ? ` {bksp}',
      '{tab} Q W E R T Z U I O P Ü *',
      '{lock} A S D F G H J K L Ö Ä \' {enter}',
      '{shift} > Y X C V B N M ; : _ {shift}',
      '.com @ {space} {cierra}'
    ]
  };
  private numerickeyboard = {
    default: ['7 8 9', '4 5 6', '1 2 3', '0 ,', '{bksp} {cierra}']
  };

  public elvalor: string;
  public errores = new BehaviorSubject<Array<string>>(new Array<string>());

  constructor(
    public dialogo: MatDialogRef<DialogKeyboardComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      control: Validador;
      placeholder: string;
      isrequired: boolean;
      tipo: string;
      suffix: string;
    }
  ) {}

  creaTeclado() {
    this.teclado = new Keyboard({
      onChange: (input) => this.onKeyboardChange(input),
      onKeyPress: (button) => this.onKeyboardKeyPressed(button),
      theme: 'hg-theme-default',
      layout: this.data.tipo === 'number' ? this.numerickeyboard : this.german,
      mergeDisplay: true,
      display: {
        '{cierra}': 'Zu'
      }
    });
  }
  // Viene del Virtual Keyboard
  onKeyboardChange(input: string) {
    // this.elvalor = input;
    // this.elInput.nativeElement.focus();
    this.data.control.formulario.setValue(input);
  }

  onKeyboardKeyPressed(boton: string) {
    if (boton === '{shift}' || boton === '{lock}') {
      this.handleShift();
    }
    if (boton === '{cierra}') {
      if (this.errores.value.length === 0) {
        this.close();
      }
    }
  }
  // Viene del teclado directamente
  onInputChange(event: any) {
    this.data.control.formulario.setValue(event.target.value);
    if (this.teclado != null) {
      this.teclado.setInput(event.target.value);
    }
  }
  handleShift = () => {
    const currentLayout = this.teclado.options.layoutName;
    const shiftToggle = currentLayout === 'default' ? 'shift' : 'default';

    this.teclado.setOptions({
      layoutName: shiftToggle
    });
  }

  onBorralo() {
    this.data.control.formulario.setValue('');
    this.teclado.setInput(this.elvalor);
  }
  public close() {
    this.dialogo.close({ salida: this.elvalor });
  }

  ngOnInit() {
    this.creaTeclado();
    this.teclado.setInput(this.data.control.formulario.value);
  }
  ngOnDestroy() {}
}
