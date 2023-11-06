import { Component, OnInit } from '@angular/core';
import { CsvService } from '../csv.service';

@Component({
  selector: 'app-statistiques',
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.css']
})
export class StatistiquesComponent implements OnInit {
  public records: any[] = [];
  public currentPage: number = 1;
  currentSortField: string = 'ID';
  sortDirection: 'asc' | 'desc' = 'asc';
  searchTerm: string = '';
  filteredRecords: any[] = [];

  constructor(private csvService: CsvService) { }

  ngOnInit() {
    this.csvService.loadData('assets/compteurs.csv')
      .then(data => {
        this.records = data;
        this.filteredRecords = [...this.records];
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
    this.currentPage = 1;
  }

  sortRecords(sortField: string) {
    if (this.currentSortField === sortField) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortField = sortField;
      this.sortDirection = 'asc';
    }

    this.filteredRecords.sort((a, b) => {
      let valueA = a[this.currentSortField];
      let valueB = b[this.currentSortField];

      // If the field is numeric, parse it as an integer
      if (!isNaN(valueA) && !isNaN(valueB)) {
        valueA = parseInt(valueA, 10);
        valueB = parseInt(valueB, 10);
      }

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}
