import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AccueilComponent } from './accueil/accueil.component';
import { ProjetsComponent } from './projets/projets.component';
import { EquipeComponent } from './equipe/equipe.component';
import { ItinerairesComponent } from './itineraires/itineraires.component';
import { StatistiquesComponent } from './statistiques/statistiques.component';
import { InteretComponent } from './interet/interet.component';
import { DynamicMapComponent } from './dynamic-map/dynamic-map.component';
import { AjouterInteretsComponent } from './ajouter-interets/ajouter-interets.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AccueilComponent,
    ProjetsComponent,
    EquipeComponent,
    ItinerairesComponent,
    StatistiquesComponent,
    InteretComponent,
    DynamicMapComponent,
    AjouterInteretsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
