import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isNavbarCollapsed = true;
  isDropdownOpen = false;
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
    this.isDropdownOpen = false;
  }
  
}
