// tslint:disable: no-bitwise
export enum SesionStates {
  Nada = 0,
  Abierto = 1 << 0,
  Cerrado = 1 << 1,
  Libre_1 = 1 << 2,
  Libre_2 = 1 << 3,
  Libre_3 = 1 << 4,
  Libre_4 = 1 << 5,
  Libre_5 = 1 << 6,
  Borrado = 1 << 7
}
// tslint:enable: no-bitwise