import { Routes } from '@angular/router';
import { HomeBeowachComponent } from './components/homebeowach/homebeowach.component';
import { AuthGuard } from '../services/auth.guard';
import { HomeLayoutComponent } from '../layouts/home-layout/home-layout.component';
import { DefinitionBeowachComponent } from './components/definition/definitionbeowach.component';
import { ControlListeBeowachComponent } from './components/controlliste/controlliste.component';
import { NeuArtikelBeowachComponent } from './components/neueartikel/neueartikelbeowach.component';
import { KorrekturListeComponent } from '../korrektur/korrektur.component';

export const beowachtungsRoutes: Routes = [
  {
    path: 'beowach',
    component: HomeLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeBeowachComponent },
      {
        path: 'definition',
        component: DefinitionBeowachComponent
      },
      { path: 'controlliste', component: ControlListeBeowachComponent },
      { path: 'neueartikel', component: NeuArtikelBeowachComponent },
      { path: 'korrektur', component: KorrekturListeComponent },

      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];
