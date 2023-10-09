import { Component } from '@angular/core';
import { CsvService } from '../csv.service'; // Ajustez le chemin

@Component({
  selector: 'app-interet',
  templateUrl: './interet.component.html',
  styleUrls: ['./interet.component.css']
})
export class InteretComponent {
  public records: any[] = [];
  public currentPage: number = 1;  // Ajouté pour la pagination

  constructor(private csvService: CsvService) { }

  ngOnInit() {
    this.csvService.loadData('assets/fontaines.csv')
      .then(data => {
        this.records = data;
      });
  }
}
