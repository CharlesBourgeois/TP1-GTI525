import { Component, OnInit } from '@angular/core';
import { CsvService } from '../csv.service'; // Ajustez le chemin

@Component({
  selector: 'app-statistiques',
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.css']
})
export class StatistiquesComponent implements OnInit {
  public records: any[] = [];
  public currentPage: number = 1;  // Ajouté pour la pagination
  currentSortField: string = 'ID';  // Par défaut, triez par ID
  sortDirection: 'asc' | 'desc' = 'asc';
  searchTerm: string = '';  // Pour suivre la valeur de recherche
  filteredRecords: any[] = [];

  constructor(private csvService: CsvService) { }

  ngOnInit() {
    this.csvService.loadData()
      .then(data => {
        this.records = data;
        this.filteredRecords = [...this.records];  // Clone le tableau après que les données soient chargées
      });
  }


  filterRecords() {
    if (this.searchTerm) {
      this.filteredRecords = this.records.filter(record =>
        record.Nom.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredRecords = this.records;
    }
    this.currentPage = 1;  // Réinitialisez la pagination
  }

  sortRecords(sortField: string) {
    if (this.currentSortField === sortField) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortField = sortField;
      this.sortDirection = 'asc';
    }

    this.filteredRecords.sort((a, b) => {
      if (a[this.currentSortField] < b[this.currentSortField]) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (a[this.currentSortField] > b[this.currentSortField]) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}
