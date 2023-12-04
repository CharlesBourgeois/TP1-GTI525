import { Component } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-itineraires',
  templateUrl: './itineraires.component.html',
  styleUrls: ['./itineraires.component.css'],
})
export class ItinerairesComponent {
  activeSeason: string = 'Saisonnier';
  showProtectedPaths: boolean = false;
  showSharedPaths: boolean = false;
  startDate!: string;
  endDate!: string;
  topArrondissements: any;

  constructor(private apiService: ApiService) {}

  fetchPopularTracks() {
    const params = {
      populaireDebut: this.startDate.split('-').join(''),
      populaireFin: this.endDate.split('-').join(''),
    };

    this.apiService
      .loadDataWithParams('http://localhost:8080/gti525/v1/pistes', params)
      .subscribe(
        (data) => {
          this.topArrondissements = data.topArrondissements;
        },
        (error) => {
          console.error('Error fetching data: ', error);
        }
      );
  }
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  openModal() {
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeModal() {
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  setActiveSeason(season: string): void {
    this.activeSeason = season;
  }

  handleProtectedPathChange(event: any): void {
    this.showProtectedPaths = event.target.checked;
  }

  handleSharedPathChange(event: any): void {
    this.showSharedPaths = event.target.checked;
  }
}
