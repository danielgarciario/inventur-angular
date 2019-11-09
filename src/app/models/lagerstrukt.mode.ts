export interface ILagerOrtDatenBank {
  cwar: string;
  loca: string;
  rega: string;
  descripcion: string;
  referencia: string;
}
export class RegaleStruct implements ILagerOrtDatenBank {
  cwar: string;
  loca: string;
  rega: string;

  descripcion: string;
  referencia: string;
}

export class LagerPlatzStruct implements ILagerOrtDatenBank {
  public cwar: string;
  public loca: string;
  public regale: Array<RegaleStruct>;
  public get referencia() {
    return this.loca;
  }
  public get descripcion() {
    return this.loca;
  }
  public readonly rega = '';
  public get hasRegale(): boolean {
    if (!this.regale) {
      return false;
    }
    return this.regale.length > 0;
  }
  /**
   *
   */
  constructor() {}
}

export class LagerStruct implements ILagerOrtDatenBank {
  public cwar: string;
  public descripcion: string;
  public lagerplatze: Array<LagerPlatzStruct>;

  public readonly loca = '';
  public readonly rega = '';
  public readonly referencia = '';
  public get hasLagerPLatze(): boolean {
    if (!this.lagerplatze) {
      return false;
    }
    return this.lagerplatze.length > 0;
  }
  /**
   *
   */
  constructor() {}
}
