export interface TipoValidador {
  mensaje: string;
  reglaIstOK(entrada: any): boolean;
}
