import {
  Component,
  AfterViewInit,
  OnInit,
  Input,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  HostListener,
  Output,
  OnDestroy,
} from '@angular/core';
import Keyboard from 'simple-keyboard';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogKeyboardComponent } from '../Teclados/DialogTeclado.component';
import { EventEmitter } from '@angular/core';
import { Validador } from '../Validador/validador.model';
import { TipoValidador } from '../Validador/TipoValidador.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-input-text',

  templateUrl: './entrada-texto.component.html',
  styleUrls: ['./entrada-texto.component.css'],
})
export class EntradaTextoComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() validador: Validador;
  @Input() placeholder: string;
  @Input() isRequired: boolean;
  @Input() tipo: 'text' | 'password' | 'number';
  @Input() suffix = '';
  @Input() Validadores?: Array<TipoValidador>;
  @Output() BorrarClick = new EventEmitter();
  // Con esto pedimos el focus
  @Input()
  set Focus(setfocus: boolean) {
    if (setfocus === true) {
      console.log('Pedimos Focus', this.elInput);
      this.elInput.nativeElement.focus();
      setfocus = false;
    }
  }
  @Output() OnMagicKey = new EventEmitter();

  @ViewChild('elinput', { static: true }) elInput: ElementRef;

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // console.log('Keyboard event', event, environment.magickey);
    if (event.key === environment.magickey) {
      this.OnMagicKey.emit();
    }
  }

  teclado: Keyboard;
  // validador: Validador;
  subchanges: Subscription;
  // errores = new BehaviorSubject<Array<string>>(new Array<string>());

  errores$: Observable<Array<string>>;
  hayerrores$: Observable<boolean>;
  elvalor: string;
  usateclado: boolean;
  isIPAD$: Observable<boolean>;

  ngOnInit() {
    this.isIPAD$ = this.breakpointObserver
      .observe(Breakpoints.Tablet)
      .pipe(map((resultado) => resultado.matches));
    this.errores$ = this.validador.errores$;
    this.hayerrores$ = this.validador.hayerrores$;
  }
  ngOnDestroy() {
    this.validador.unSubscribe();
  }

  ngAfterViewInit() {}
  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private miref: ElementRef
  ) {}

  // Viene del teclado directamente
  onInputChange(event: any) {
    this.validador.formulario.setValue(event.target.value);
    // this.elvalor = event.target.value;
  }

  onborralo() {
    this.validador.formulario.setValue('');
  }
  showkeyboard() {
    const midata = {
      control: this.validador,
      placeholder: this.placeholder,
      isrequired: this.isRequired,
      tipo: this.tipo,
      suffix: this.suffix,
      validadores: this.Validadores,
    };
    const dialogopts: MatDialogConfig = {
      data: midata,
    };
    if (this.tipo === 'number') {
      dialogopts.width = '350px';
      dialogopts.height = '450px';
    } else {
      dialogopts.width = '910px';
      dialogopts.height = '440px';
    }

    const dialogref = this.dialog.open(DialogKeyboardComponent, dialogopts);
    // dialogref.afterClosed().subscribe((salida) => {
    //   console.log('Retorno de teclado');
    //   console.log(salida);
    //   this.formcontrol.setValue(salida.salida);
    //   this.elvalor = salida.salida;
    // });
  }
}
