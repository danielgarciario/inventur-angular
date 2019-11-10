import { Component, OnDestroy, Input, OnInit } from '@angular/core';
import { ILagerOrtDatenBank } from 'src/app/models/lagerstrukt.model';
import { Observable, Subscription } from 'rxjs';
import { Artikel } from 'src/app/models/artikel.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-partlagerort-detail',
  templateUrl: './partlagerort.component.html',
  styleUrls: ['partlagerort.component.css']
})
export class PartialLagerOrtComponent implements OnInit, OnDestroy {
  @Input() lagerort: ILagerOrtDatenBank;

  // subskandidato: Subscription;
  // subslagerort: Subscription;
  // lagerot$: Observable<ILagerOrtDatenBank>;
  // lagerort: ILagerOrtDatenBank;
  /**
   *
   */
  constructor() {}

  ngOnInit() {
    // this.lagerot$ = this.kandidato$.pipe(map((x) => x.lagerot));
    // console.log('Compoonent con Lagerort');
    // this.subskandidato = this.kandidato$.subscribe((c) => {
    //   console.log('Nuevo Kandidato', c);
    // });
    // this.subslagerort = this.lagerot$.subscribe((lo) => {
    //   console.log('Nuevo lagerort', lo);
    //   this.lagerort = lo;
    // });
  }
  ngOnDestroy() {
    // this.subslagerort.unsubscribe();
    // this.subskandidato.unsubscribe();
  }
}
