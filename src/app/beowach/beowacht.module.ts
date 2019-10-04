import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppMaterialModule } from '../app-material/app-material.module';
import { HomeBeowachComponent } from './components/homebeowach/homebeowach.component';
import { beowachtungsRoutes } from './beowachtungs.routes';
import { DefinitionBeowachComponent } from './components/definition/definitionbeowach.component';
import { ControlListeBeowachComponent } from './components/controlliste/controlliste.component';
import { LagerControlBeowachComponent } from './components/definition/parciales/lagercontrol/lagercontrolbeowach.component';
import { LagerVerbrauchBeowachComponent } from './components/definition/parciales/lagerverbrauch/lagerverbrauchbeowach.component';
import { LagerBestandBeowachComponent } from './components/definition/parciales/lagerbestand/lagerbestandbeowach.component';
import { LeadTimeBeowachComponent } from './components/definition/parciales/leadtime/leadtimebeowach.component';
import { SimulacionBeowachComponent } from './components/definition/parciales/simulacion/simulacionbeowach.component';
import { ControlListeIndexBeowachComponent } from './components/controlliste/Componentes/controllisteindex.component';
import { NeuArtikelBeowachComponent } from './components/neueartikel/neueartikelbeowach.component';
// tslint:disable-next-line: max-line-length
import { EditMaxBestandDialogComponent } from './components/definition/parciales/lagercontrol/editmaxbestand/editmaxbestandbeowach.component';
import { ConfirmDeletebeowachComponent } from './components/confirmDelete/confirmDeleteBeowach.component';
import { KorrekturListeComponent } from '../korrektur/korrektur.component';
import { KorrekturMasivListeComponent } from '../korrektur/korrektur.masiv/korrektur.masiv.component';
import { KorrekturIDListeComponent } from '../korrektur/korrekturID/korrektur.id.component';
// tslint:disable-next-line: max-line-length
import { ArtikelLagerControlBeowachComponent } from './components/definition/parciales/lagercontrol/artikeldef/artikeldef.lagercontrolbeo.component';
// tslint:disable-next-line: max-line-length
import { CapacidadesLagerControlBeowachComponent } from './components/definition/parciales/lagercontrol/capacidad/capacidaddef.lagercontrolbeo.component';
// tslint:disable-next-line: max-line-length
import { MeldungsMindesLagerControlBeowachComponent } from './components/definition/parciales/lagercontrol/meldungsbestand/melbestanddef.lagercontrol.component';

@NgModule({
  declarations: [
    HomeBeowachComponent,
    DefinitionBeowachComponent,
    ControlListeBeowachComponent,
    LagerControlBeowachComponent,
    LagerVerbrauchBeowachComponent,
    LagerBestandBeowachComponent,
    LeadTimeBeowachComponent,
    SimulacionBeowachComponent,
    ControlListeIndexBeowachComponent,
    NeuArtikelBeowachComponent,
    EditMaxBestandDialogComponent,
    ConfirmDeletebeowachComponent,
    KorrekturListeComponent,
    KorrekturMasivListeComponent,
    KorrekturIDListeComponent,
    ArtikelLagerControlBeowachComponent,
    CapacidadesLagerControlBeowachComponent,
    MeldungsMindesLagerControlBeowachComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AppMaterialModule,
    RouterModule.forChild(beowachtungsRoutes)
  ],
  entryComponents: [
    EditMaxBestandDialogComponent,
    ConfirmDeletebeowachComponent
  ]
})
export class BeowachtungsModule {}
