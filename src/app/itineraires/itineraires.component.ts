import { Component } from '@angular/core';

@Component({
  selector: 'app-itineraires',
  templateUrl: './itineraires.component.html',
  styleUrls: ['./itineraires.component.css']
})
export class ItinerairesComponent {
  // Function to open the modal
  openModal() {
    console.log("test");

    const modal = document.getElementById('myModal');
    console.log(modal);

    if (modal) {
      modal.style.display = 'block';
    }
  }

  // Function to close the modal
  closeModal() {
    console.log("test2");

    const modal = document.getElementById('myModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
}
