export interface IDiccionarioTye<T> {
  [clave: string]: T;
}

export interface IDiccionario<T> {
  add(valor: T): void;
  remove(valor: T): void;
  contains(valor: T): boolean;
  keys(): Array<string>;
  valores(): Array<T>;
  numelementos(): number;
}

export class Diccionario<T> {
  private claves: Array<string> = new Array<string>();
  private valores: Array<T> = new Array<T>();

  protected getClave(valor: T): string {
    return JSON.stringify(valor);
  }

  add(valor: T) {
    const clave = this.getClave(valor);
    this[clave] = valor;
    this.claves.push(clave);
    this.valores.push(valor);
  }
  remove(valor: T) {
    const clave = this.getClave(valor);
    const indice = this.claves.indexOf(clave, 0);
    this.claves.splice(indice, 1);
    this.valores.splice(indice, 1);
    delete this[clave];
  }
  keys(): Array<string> {
    return this.claves;
  }
  values(): Array<T> {
    return this.valores;
  }
  contains(valor: T): boolean {
    const clave = this.getClave(valor);
    return typeof this[clave] !== 'undefined';
  }
  numelementos(): number {
    return this.claves.length;
  }
  clear(): void {
    const copivalores = [...this.valores];
    copivalores.forEach((f) => this.remove(f));
  }
}

// export class Diccionario<T> {
//   private claves: Array<string> = new Array<string>();
//   private valores: Array<T> = new Array<T>();

//   add(valor: T) {
//     const clave = JSON.stringify(valor);
//     this[clave] = valor;
//     this.claves.push(clave);
//     this.valores.push(valor);
//   }
//   remove(valor: T) {
//     const clave = JSON.stringify(valor);
//     const indice = this.claves.indexOf(clave, 0);
//     this.claves.splice(indice, 1);
//     this.valores.splice(indice, 1);
//     delete this[clave];
//   }
// }
