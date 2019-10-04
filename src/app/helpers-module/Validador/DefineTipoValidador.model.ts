import { TipoValidador } from './TipoValidador.interface';

export class DefineTipoValidador<T> implements TipoValidador {
  private fvalidacion: (entrada: T) => boolean;
  set fValidacionOK(mifuncion: (entrada: T) => boolean) {
    this.fvalidacion = mifuncion;
  }

  reglaIstOK(entrada: any) {
    if (this.fvalidacion === null) {
      return true;
    }
    if (this.fvalidacion === undefined) {
      return true;
    }
    const testentrada = entrada as T;
    if (testentrada === null) {
      return false;
    }
    if (testentrada === undefined) {
      return false;
    }
    return this.fvalidacion(testentrada);
  }

  constructor(public mensaje: string) {}
}

export class DefineTipoValidadorMayorIgualQue extends DefineTipoValidador<
  number
> {
  constructor(valor: number) {
    super(`es muss großer oder gleich als ${valor}`);
    super.fValidacionOK = (e: number) => e >= valor;
  }
}
export class DefineTipoValidadorMenorIgualQue extends DefineTipoValidador<
  number
> {
  constructor(valor: number) {
    super(`es muss kleiner oder gleich als ${valor}`);
    super.fValidacionOK = (e: number) => e <= valor;
  }
}
export class DefineTipoValidadorMaximoLargo extends DefineTipoValidador<
  string
> {
  constructor(largomaximo: number) {
    super(`es muss kleiner als ${largomaximo} Buchstaben`);
    super.fValidacionOK = (e) => e.length <= largomaximo;
  }
}

export const ValidadorNoEstaVacio = new DefineTipoValidador<string>(
  'Muss nicht leer sein'
);
ValidadorNoEstaVacio.fValidacionOK = (e) => e.length > 0;

export const ValidadorMayorIgualQueCero = new DefineTipoValidador<number>(
  'Muss großer oder gleich als 0'
);
ValidadorMayorIgualQueCero.fValidacionOK = (e) => e >= 0;
