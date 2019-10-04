import { Component, OnInit } from '@angular/core';
import { KorrekturFacadeService } from '../services/facade/korrektur.facade.service';
import { Observable } from 'rxjs';
import { KorrekturMasiv } from '../models/korrektur.model';

@Component({
  selector: 'app-korr-korrekturliste',
  templateUrl: './korrektur.component.html',
  styleUrls: ['./korrektur.component.css']
})
export class KorrekturListeComponent implements OnInit {
  constructor(private kor: KorrekturFacadeService) {}

  ngOnInit() {}
}
