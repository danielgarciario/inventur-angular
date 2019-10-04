import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BeowachtService } from 'src/app/services/beowacht.service';
import { Observable } from 'rxjs';
import { LagerControl } from 'src/app/models/lagercontrol.model';
import { ControlListeFacadeService } from 'src/app/services/facade/controlListe.facade.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Validador } from 'src/app/helpers-module/Validador/validador.model';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { ConfirmDeletebeowachComponent } from '../confirmDelete/confirmDeleteBeowach.component';
import { filter, switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-beo-controlliste',
  templateUrl: './controlliste.component.html',
  styleUrls: ['./controlliste.component.css']
})
export class ControlListeBeowachComponent implements OnInit, OnDestroy {
  articulos$: Observable<Array<LagerControl>>;
  loadingArticulo$: Observable<boolean>;
  sArtNr: Validador;
  sArtBes: Validador;
  sLp: Validador;

  constructor(
    public beo: ControlListeFacadeService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogo: MatDialog,
    private snackBar: MatSnackBar,
    private location: Location
  ) {
    this.articulos$ = this.beo.articulosliste$;
    // this.articulos$ = this.beo.articulos$;
    this.loadingArticulo$ = this.beo.isLoadingArtikels$;
    this.sArtNr = new Validador(this.beo.buscaArtikelNrFC);
    this.sArtBes = new Validador(this.beo.buscaArtBeschFC);
    this.sLp = new Validador(this.beo.buscaLagerPlatzFC);
  }
  ongotoArtikel(cual: LagerControl) {
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
  ongotoNeueArtikel() {
    this.router.navigate(['../neueartikel'], { relativeTo: this.route });
  }
  ondeleteArtikel(cual: LagerControl) {
    const entrada = {
      title: `Artikel ${cual.articulo.artikelnr} im Lager ${cual.cwar} lössen`,
      // tslint:disable-next-line: max-line-length
      text: `<p>Wollen Sie wirklich die Artikel ${cual.articulo.artikelnr} von Lager ${cual.cwar} lössen?</p><p>${cual.articulo.beschreibung}</p>`
      // delete: this.beo.deleteArticulo(cual)
    };
    const dialogopts: MatDialogConfig = {
      data: entrada,
      width: '600px',
      height: '400px'
    };
    const dialogref = this.dialogo.open(
      ConfirmDeletebeowachComponent,
      dialogopts
    );
    dialogref.afterClosed().subscribe((s) => {
      console.log(` - Borrado -- ${s}`);
    });
    dialogref
      .afterClosed()
      .pipe(
        filter((s: boolean) => s),
        switchMap(() => this.beo.deleteArticulo(cual))
      )
      .subscribe((res) => {
        let mensaje = 'Erflogreich gelöscht!';
        if (res !== undefined) {
          if (res.length > 0) {
            mensaje = res;
          }
        }
        this.snackBar.open(mensaje, null, { duration: 5000 });
      });
  }

  onZuruck() {
    this.location.back();
  }

  ngOnInit() {
    // this.beo.cargarArticulos();
  }
  ngOnDestroy() {}
}
