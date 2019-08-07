import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-neueposition',
  templateUrl: './neueposition.component.html',
  styleUrls: ['./neueposition.component.scss']
})
export class NeuePositionComponent implements OnInit, OnDestroy {
  snapshot: ActivatedRouteSnapshot;

  constructor(private route: ActivatedRoute) {
    this.snapshot = route.snapshot;
  }
  ngOnInit() {
    const id = +this.snapshot.paramMap.get('id');
    console.log(`En NeuePosition para ID= ${id}`);
  }
  ngOnDestroy() {}
}
