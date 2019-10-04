import { Component, OnInit, OnDestroy } from '@angular/core';
import { ControlListeFacadeService } from 'src/app/services/facade/controlListe.facade.service';
import { Observable, Subscription } from 'rxjs';
import { LagerControl } from 'src/app/models/lagercontrol.model';
import { FormControl } from '@angular/forms';
import { Paginador } from '../../../helpers-module/paginador/paginador.component';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Validador } from 'src/app/helpers-module/Validador/validador.model';

@Component({
  selector: 'app-beo-neueartikel',
  templateUrl: './neueartikelbeowach.component.html',
  styleUrls: ['./neueartikelbeowach.component.css']
})
export class NeuArtikelBeowachComponent implements OnInit, OnDestroy {
  searchExistentes$: Observable<Array<LagerControl>>;
  searchKandidatos$: Observable<Array<LagerControl>>;
  isLoadingArticulos$: Observable<boolean>;
  isLoadingKandidatos$: Observable<boolean>;
  pKandidatos: Paginador<LagerControl>;
  pExistentes: Paginador<LagerControl>;
  artikelNrFC: Validador;
  artikelBesFC: Validador;
  lagerplatzFC: Validador;
  tempsubs = new Array<Subscription>();

  constructor(
    public beo: ControlListeFacadeService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // this.searchExistentes$ = this.beo.searchExistentes$;
    // this.searchKandidatos$ = this.beo.searchKandidatos$;
    this.searchExistentes$ = this.beo.searcharticulosliste$;
    this.searchKandidatos$ = this.beo.searchkandidatosliste$;
    this.isLoadingArticulos$ = this.beo.isLoadingArtikels$;
    this.isLoadingKandidatos$ = this.beo.isLoadingKandidatos$;
    this.artikelNrFC = new Validador(this.beo.searchArtikelNrFC);
    this.artikelBesFC = new Validador(this.beo.searchArtBeschFC);
    this.lagerplatzFC = new Validador(this.beo.searchLagerPlatzFC);
    this.pKandidatos = new Paginador<LagerControl>(this.searchKandidatos$);
    this.pExistentes = new Paginador<LagerControl>(this.searchExistentes$);
  }

  onAddArtikel(cual: LagerControl) {
    this.tempsubs.push(
      this.beo.addArticulo(cual).subscribe((sal) => {
        if (sal.length > 0) {
          this.snackBar.open(sal, null, { duration: 5000 });
          return;
        } else {
          this.onGotoArtikel(cual);
        }
      })
    );
  }
  onGotoArtikel(cual: LagerControl) {
    this.router.navigate(
      [
        '../definition',
        {
          lager: cual.cwar,
          item: cual.articulo.artikelnr
        }
      ],
      { relativeTo: this.route }
    );
  }
  onDeleteArtikel(cual: LagerControl) {
    this.tempsubs.push(
      this.beo.deleteArticulo(cual).subscribe((sal) => {
        this.snackBar.open(
          sal.length > 0 ? sal : 'Erfolgriech gelöscht',
          null,
          { duration: 5000 }
        );
      })
    );
  }

  ngOnInit() {
    // this.beo.cargaKandidatos();
  }
  ngOnDestroy() {
    // this.pKandidatos.unsubscribe();
    // this.pExistentes.unsubscribe();
    for (const iterator of this.tempsubs) {
      iterator.unsubscribe();
    }
  }
}
