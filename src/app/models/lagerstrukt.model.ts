export interface ILagerOrtDatenBank {
  cwar: string;
  loca: string;
  rega: string;
  descripcion: string;
  referencia: string;
  hijos: Array<ILagerOrtDatenBank>;
}
export class RegaleStruct implements ILagerOrtDatenBank {
  cwar: string;
  loca: string;
  rega: string;

  descripcion: string;
  referencia: string;
  hijos = null;
}

export class LagerPlatzStruct implements ILagerOrtDatenBank {
  public cwar: string;
  public loca: string;
  public regale: Array<RegaleStruct>;
  public referencia: string;
  public descripcion: string;
  public rega: string;
  public get hasRegale(): boolean {
    if (!this.regale) {
      return false;
    }
    return this.regale.length > 0;
  }
  public hijos: Array<ILagerOrtDatenBank>;
  /**
   *
   */
  constructor() {}
}

export class LagerStruct implements ILagerOrtDatenBank {
  public cwar: string;
  public descripcion: string;
  public lagerplatze: Array<LagerPlatzStruct>;

  public loca: string;
  public rega: string;
  public referencia: string;
  public get hasLagerPLatze(): boolean {
    if (this.lagerplatze == null) {
      return false;
    }
    return this.lagerplatze.length > 0;
  }
  public hijos: Array<ILagerOrtDatenBank>;
  /**
   *
   */
  constructor() {}
}
