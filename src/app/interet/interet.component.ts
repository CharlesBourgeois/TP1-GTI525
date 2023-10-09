import { Component } from '@angular/core';
import { CsvService } from '../csv.service';

@Component({
  selector: 'app-interet',
  templateUrl: './interet.component.html',
  styleUrls: ['./interet.component.css']
})
export class InteretComponent {
  public records: any[] = [];
  public currentPage: number = 1;

  constructor(private csvService: CsvService) { }

  ngOnInit() {
    this.csvService.loadData('assets/fontaines.csv')
      .then(data => {
        this.records = data;
      });
  }
}
