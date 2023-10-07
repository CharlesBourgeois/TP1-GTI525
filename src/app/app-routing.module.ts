import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { EquipeComponent } from './equipe/equipe.component';
import { ProjetsComponent } from './projets/projets.component';

const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'equipe', component: EquipeComponent },
  { path: 'projets', component: ProjetsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
