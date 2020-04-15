import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Observable, BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { Sort } from '@angular/material';
import { map, tap } from 'rxjs/operators';

export interface TipoDefinicionOrden<T> {
  campo: string; // <-- Nombre del campo a ordenar;
  funcascendente(a: T, b: T): number; // <-- Funcion a ordenar debe devolver -1, 0, 1;
}

export interface EstadoPaginador {
  numelementos: number;
  numeropaginas: number;
  pagina: number;
  elementoPorPagina: number;
}

export interface TipoPaginador {
  numelementos$: Observable<number>;
  numeropaginas$: Observable<number>;
  pagina$: Observable<number>;
  elementoPorPagina$: Observable<number>;
  estadopaginador$: Observable<EstadoPaginador>;
  gotoPage(pag: number);
  gotoNext();
  gotoPrevious();
  gotoFirst();
  gotoLast();
}

export class Paginador<T> implements TipoPaginador {
  // private displayBehaviour: BehaviorSubject<Array<T>>;
  display$: Observable<Array<T>>;
  cargamibase$: Observable<Array<T>>;

  numelementos$: Observable<number>;
  pagina$: Observable<number>;
  numeropaginas$: Observable<number>;
  estadopaginador$: Observable<EstadoPaginador>;
  elementoPorPagina$: Observable<number>;
  listaelementosPorPagina: Array<number> = [20, 50, 100];
  elestado = new BehaviorSubject<{
    paginador: EstadoPaginador;
    orden: Sort;
  }>({
    paginador: {
      numelementos: 0,
      pagina: 1,
      numeropaginas: 1,
      elementoPorPagina: this.listaelementosPorPagina[0]
    },
    orden: {
      active: '',
      direction: ''
    }
  });

  constructor(
    public mibase: Observable<Array<T>>,
    private ordenador?: Array<TipoDefinicionOrden<T>>
  ) {
    this.numelementos$ = this.elestado.pipe(
      map((s) => s.paginador.numelementos)
    );
    this.pagina$ = this.elestado.pipe(map((s) => s.paginador.pagina));
    this.numeropaginas$ = this.elestado.pipe(
      map((s) => s.paginador.numeropaginas)
    );
    this.elementoPorPagina$ = this.elestado.pipe(
      map((s) => s.paginador.elementoPorPagina)
    );

    this.cargamibase$ = this.mibase.pipe(
      tap((x) => {
        this.recalculanumpaginas(x.length);
        console.log('recalculando #paginas');
      })
    );
    this.estadopaginador$ = this.elestado.pipe(map((s) => s.paginador));
    this.display$ = combineLatest(this.cargamibase$, this.elestado).pipe(
      map(([d, e]) => {
        let datos = [...d];
        const ord = e.orden;
        if (ord.active && ord.direction !== '') {
          const isAsc = ord.direction === 'asc';
          if (ordenador !== null) {
            if (ordenador !== undefined) {
              const campos = ordenador.filter((x) => x.campo === ord.active);
              if (campos.length > 0) {
                const campo = campos[0];
                if (isAsc) {
                  datos = datos.sort(campo.funcascendente);
                } else {
                  datos = datos.sort((a, b) => -1 * campo.funcascendente(a, b));
                }
              }
            }
          }
        }
        const pag = e.paginador;
        if (pag.pagina > 0 && pag.pagina <= pag.numeropaginas) {
          const inicio = (pag.pagina - 1) * pag.elementoPorPagina;
          const final = inicio + pag.elementoPorPagina;
          datos = datos.slice(inicio, final);
        }
        console.log(`Emitiendo nuevos Datos: cuantos ${datos.length}`);
        return datos;
      })
    );
  }

  onSort(cual: Sort) {
    this.ActualizaEstado({ ...this.elestado.value, orden: cual });
  }

  private recalculanumpaginas(elem: number): void {
    this.ActualizaEstado({
      ...this.elestado.value,
      paginador: {
        ...this.elestado.value.paginador,
        numelementos: elem,
        pagina: 1,
        numeropaginas:
          1 + Math.floor(elem / this.elestado.value.paginador.elementoPorPagina)
      }
    });
  }
  gotoPage(numpagina: number) {
    if (
      numpagina > 0 &&
      numpagina <= this.elestado.value.paginador.numeropaginas
    ) {
      this.ActualizaEstado({
        ...this.elestado.value,
        paginador: { ...this.elestado.value.paginador, pagina: numpagina }
      });
    }
  }
  gotoNext() {
    if (
      this.elestado.value.paginador.pagina >=
      this.elestado.value.paginador.numeropaginas
    ) {
      return;
    }
    const pagina = this.elestado.value.paginador.pagina;
    this.gotoPage(pagina + 1);
  }
  gotoPrevious() {
    const pagina = this.elestado.value.paginador.pagina;
    if (pagina <= 1) {
      return;
    }
    this.gotoPage(pagina - 1);
  }

  gotoFirst() {
    this.gotoPage(1);
  }
  gotoLast() {
    this.gotoPage(this.elestado.value.paginador.numeropaginas);
  }

  private ActualizaEstado(nuevoestado: {
    paginador: EstadoPaginador;
    orden: Sort;
  }): void {
    this.elestado.next(nuevoestado);
  }
}

@Component({
  selector: 'app-paginador',
  templateUrl: './paginador.component.html',
  styleUrls: ['./paginador.component.css']
})
export class PaginadorComponent implements OnInit, OnDestroy {
  @Input() elpaginador: TipoPaginador;

  ngOnInit() {}
  ngOnDestroy() {}
}
