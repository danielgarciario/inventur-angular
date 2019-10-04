import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LagerControl } from 'src/app/models/lagercontrol.model';
import { SessionsService } from 'src/app/services/sessions.service';
import { switchMap, map, tap } from 'rxjs/operators';
import { Artikel } from 'src/app/models/artikel.model';

@Component({
  selector: 'app-beo-lagercontrol-artikel',
  templateUrl: './artikeldef.lagercontrolbeo.component.html',
  styleUrls: ['./artikeldef.lagercontrolbeo.component.css']
})
export class ArtikelLagerControlBeowachComponent implements OnInit, OnDestroy {
  @Input() lagercontrol$: Observable<LagerControl>;

  artikel$: Observable<Artikel>;
  imagendata$: Observable<any>;
  noImagen = true;
  isLoadingImage = false;
  isloading = true;
  subdata: Subscription;

  constructor(private sesser: SessionsService) {}

  ngOnInit() {
    this.subdata = this.lagercontrol$.subscribe((p) => {
      this.isloading = false;
    });
    this.artikel$ = this.lagercontrol$.pipe(map((x) => x.articulo));
    this.imagendata$ = this.lagercontrol$.pipe(
      tap((x) => (this.isLoadingImage = true)),
      switchMap((ar) => this.sesser.getImagen(ar.articulo.artikelnr)),
      tap((x) => {
        this.isLoadingImage = false;
        this.noImagen = x === null;
      }),
      map((p) => 'data:image/jpg;base64,' + p)
    );
  }
  ngOnDestroy() {
    this.subdata.unsubscribe();
  }
}
