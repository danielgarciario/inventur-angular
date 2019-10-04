import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LagerControl } from 'src/app/models/lagercontrol.model';
import { Observable } from 'rxjs';
import { BeowachtService } from 'src/app/services/beowacht.service';
import { WocheVerbrauch } from 'src/app/models/wochenverbrauch.model';
import { EndeWocheBestand } from 'src/app/models/endewochebestand.model';
import { LeadTime } from 'src/app/models/leadtime.model';
import { ControlListeFacadeService } from 'src/app/services/facade/controlListe.facade.service';

@Component({
  selector: 'app-beo-definition',
  templateUrl: './definitionbeowach.component.html',
  styleUrls: ['./definitionbeowach.component.css']
})
export class DefinitionBeowachComponent {
  public lager: string;
  public item: string;
  public lagercontrol$: Observable<LagerControl>;
  public consumo$: Observable<Array<WocheVerbrauch>>;
  public bestand$: Observable<Array<EndeWocheBestand>>;
  public leadtime$: Observable<LeadTime>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private beoserv: BeowachtService,
    private beo: ControlListeFacadeService
  ) {
    this.route.params.subscribe((p) => {
      this.lager = p.lager;
      this.item = p.item;
      // this.lagercontrol$ = this.beoserv.getLagerControlItemLager(
      //   this.lager,
      //   this.item
      // );
      this.lagercontrol$ = this.beo.getLagerControl(this.lager, this.item);
      this.consumo$ = this.beoserv.getWochenVerbrauch(this.lager, this.item);
      this.bestand$ = this.beoserv.getEndeWocheBestand(this.lager, this.item);
      this.leadtime$ = this.beoserv.getLeadTime(this.lager, this.item);
    });
  }
  zuruck() {
    this.location.back();
  }
}
