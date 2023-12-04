import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { EquipeComponent } from './equipe/equipe.component';
import { ProjetsComponent } from './projets/projets.component';
import { ItinerairesComponent } from './itineraires/itineraires.component';
import { StatistiquesComponent } from './statistiques/statistiques.component';
import { InteretComponent } from './interet/interet.component';
import { AjouterInteretsComponent } from './ajouter-interets/ajouter-interets.component';

const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'equipe', component: EquipeComponent },
  { path: 'projets', component: ProjetsComponent },
  { path: 'itineraires', component: ItinerairesComponent },
  { path: 'statistiques', component: StatistiquesComponent },
  { path: 'interet', component: InteretComponent },
  { path: 'ajouter-interet/:editingInterestPointId', component: AjouterInteretsComponent},
  { path: 'ajouter-interet', component: AjouterInteretsComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
