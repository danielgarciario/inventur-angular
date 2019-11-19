import { Diccionario } from './diccionario';

export class Seleccionador<T> {
  private dic: Diccionario<T> = new Diccionario<T>();

  constructor() {}

  clear() {
    this.dic.clear();
  }
  isSelected(valor: T): boolean {
    return this.dic.contains(valor);
  }
  select(valor: T) {
    if (!this.dic.contains(valor)) {
      this.dic.add(valor);
    }
  }
  hasValue(): boolean {
    return this.dic.numelementos() > 0;
  }
  toggle(valor: T) {
    if (!this.dic.contains(valor)) {
      this.dic.add(valor);
      return;
    }
    this.dic.remove(valor);
  }
  selected(): Array<T> {
    return this.dic.values();
  }
}
