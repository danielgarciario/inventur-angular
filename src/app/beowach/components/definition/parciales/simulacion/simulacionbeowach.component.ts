import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { WocheVerbrauch } from 'src/app/models/wochenverbrauch.model';
import { LagerControl } from 'src/app/models/lagercontrol.model';
import { FormControl, Validators } from '@angular/forms';
import { Dictionary } from '@ngrx/entity';

@Component({
  selector: 'app-beo-simulation',
  templateUrl: './simulacionbeowach.component.html',
  styleUrls: ['./simulacionbeowach.component.css']
})
export class SimulacionBeowachComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input() consumo$: Observable<Array<WocheVerbrauch>>;
  @Input() LagerControl$: Observable<LagerControl>;

  consumo: Array<WocheVerbrauch>;
  loadingconsumo = true;
  loadinglagercontrol = true;
  consumovacio = true;
  lagercontrolvacio = true;
  subconsumo: Subscription;
  sublagercontrol: Subscription;
  maxleadtime = 8;
  porcentajeminimo = 90;
  cuni: string;
  matrizresultados: Array<{
    woche: number;
    clave: number;
    percentaje: number;
  }>;
  lagercontrol: LagerControl;

  leadtimevwochenfc = new FormControl(+1, {
    validators: [Validators.min(1), Validators.required]
  });

  ngAfterViewInit() {
    // this.leadtimevwochenfc = new FormControl(1, {
    //   validators: [Validators.min(1), Validators.required]
    // });
  }

  public get leadTime(): number {
    if (!this.leadtimevwochenfc.valid) {
      return 1;
    }
    return this.leadtimevwochenfc.value as number;
  }

  ngOnInit() {
    this.subconsumo = this.consumo$.subscribe((c) => {
      this.consumo = c;
      this.loadingconsumo = false;
      this.consumovacio = c === undefined || c.length === 0;
      if (!this.consumovacio) {
        this.cuni = c[0].cuni;
        this.matrizresultados = this.resuelveMatriz();
      }
    });
    this.sublagercontrol = this.LagerControl$.subscribe((lc) => {
      this.lagercontrol = lc;
      this.loadinglagercontrol = false;
      this.lagercontrolvacio = lc === undefined;
    });
  }

  ngOnDestroy() {
    this.subconsumo.unsubscribe();
    this.sublagercontrol.unsubscribe();
  }

  private suma(arr: Array<number>): number {
    return arr.reduce((a, b) => a + b);
  }
  private corta(
    arr: Array<number>,
    index: number,
    tamano: number
  ): Array<number> {
    return arr.slice(index - tamano, index);
  }

  private acumulalos(cuales: Array<number>, tamano: number): Array<number> {
    let indice = tamano - 1;
    const len = cuales.length + 1;
    const salida = new Array<number>();
    while (++indice < len) {
      salida.push(this.suma(this.corta(cuales, indice, tamano)));
    }
    return salida;
  }
  private unicos(cuales: Array<number>) {
    return [...new Set(cuales)].sort((n1, n2) => n1 - n2);
  }
  private cuenta(
    cuales: Array<number>,
    datos: Array<number>
  ): Array<{ clave: number; percent: number }> {
    const salida = new Array<{ clave: number; percent: number }>();
    let acumula = 0;
    for (const clave of cuales) {
      const cuantos = datos.filter((x) => x === clave).length;
      acumula += cuantos;
      const dato = {
        clave,
        percent: acumula
      };
      salida.push(dato);
    }
    return salida.map((x) => {
      return { clave: x.clave, percent: (x.percent * 100) / acumula };
    });
  }
  public fDistribucion(
    lead: number
  ): Array<{ clave: number; percent: number }> {
    if (this.consumo === undefined) {
      return null;
    }
    if (this.consumovacio) {
      return null;
    }
    const datos = this.consumo.map((x) => x.menge);
    const acum = this.acumulalos(datos, lead);
    const unicos = this.unicos(acum);
    return this.cuenta(unicos, acum);
  }
  public getCuantosNecesito(
    leadtimewoche: number,
    porcentajeminimo: number
  ): { clave: number; percent: number } {
    const fdist = this.fDistribucion(leadtimewoche);
    if (fdist === null) {
      return null;
    }
    return fdist.filter((x) => x.percent >= porcentajeminimo)[0];
  }
  resuelveMatriz(): Array<{
    woche: number;
    clave: number;
    percentaje: number;
  }> {
    const salida = new Array<{
      woche: number;
      clave: number;
      percentaje: number;
    }>();
    for (let woche = 1; woche <= this.maxleadtime; woche++) {
      const prueba = this.getCuantosNecesito(woche, this.porcentajeminimo);
      if (prueba !== null) {
        let dato: { woche: number; clave: number; percentaje: number };
        dato = {
          woche,
          clave: prueba.clave,
          percentaje: prueba.percent
        };
        salida.push(dato);
      }
    }
    return salida;
  }

  esMarcador(entrada: {
    woche: number;
    clave: number;
    percentaje: number;
  }): boolean {
    if (this.consumovacio) {
      return false;
    }
    if (this.loadinglagercontrol) {
      return false;
    }
    const pasan = this.matrizresultados.filter(
      (x) => x.clave >= this.lagercontrol.meldungsbestand
    );
    if (pasan.length === 0) {
      return false;
    }
    return entrada.woche === pasan[0].woche;
  }
}
