import { Component } from '@angular/core';

@Component({
  selector: 'app-itineraires',
  templateUrl: './itineraires.component.html',
  styleUrls: ['./itineraires.component.css']
})
export class ItinerairesComponent {

  activeSeason: string = 'Saisonnier';
  showProtectedPaths: boolean = false;
  showSharedPaths: boolean = false;

  constructor() { }  
  
  // Function to open the modal
  openModal() {
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  // Function to close the modal
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
