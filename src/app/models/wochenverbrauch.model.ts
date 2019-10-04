export interface WocheVerbrauch {
  cwar: string;
  item: string;
  cuni: string;
  jahr_kw: number;
  kw: number;
  menge: number;
}

export interface GrupoWocheVerbrauch {
  cwar: string;
  item: string;
  cuni: string;
  grupo: number;
  menge: number;
}
export interface FdistribucionVerbrauch {
  cwar: string;
  item: string;
  cuni: string;
  menge: number;
  procent: number;
}
