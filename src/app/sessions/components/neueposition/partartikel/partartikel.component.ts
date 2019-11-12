import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Artikel } from 'src/app/models/artikel.model';

@Component({
  selector: 'app-partartikel-detail',
  templateUrl: './partartikel.component.html',
  styleUrls: ['./partartikel.component.css']
})
export class PartialArtikelComponent implements OnInit, OnDestroy {
  @Input() artikel: Artikel;

  ngOnInit() {}
  ngOnDestroy() {}
}
