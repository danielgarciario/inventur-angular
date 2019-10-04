// tslint:disable: no-bitwise
export enum SesionStates {
  Nada = 0,
  Abierto = 1, // 1 << 0,
  Cerrado = 2, // 1 << 1,
  Libre_1 = 4, // 1 << 2,
  Libre_2 = 8, // 1 << 3,
  Libre_3 = 16, // 1 << 4,
  Libre_4 = 32, // 1 << 5,
  Inventario = 64, // 1 << 6,
  Borrado = 128 // 1 << 7
}
// tslint:enable: no-bitwise
