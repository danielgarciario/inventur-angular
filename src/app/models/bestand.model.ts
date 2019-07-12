export interface Bestand {
  idbtnd: number;
  idsespos: number;
  qhnd: number;
  qblk: number;
  qlal: number;
  qord: number;
  ldatum: Date;
}

export interface BestandID extends Bestand {
  serl: string;
}
