import { Component, ViewChild } from '@angular/core';
import { CsvService } from '../csv.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-ajouter-interets',
  templateUrl: './ajouter-interets.component.html',
  styleUrls: ['./ajouter-interets.component.css']
})
export class AjouterInteretsComponent {
  public territoires: any[] = [];
  public submitted = false;
  @ViewChild('interestPointForm') interestPointForm!: NgForm;
  public interestPoint: any = {
    name: '',
    address: '',
    postalCode: '',
    district: 1,
    availability: '',
    type: 'fountain', 
    latitude: '',
    longitude: '',
    remarks: ''
  };

  constructor(private http: HttpClient, private csvService: CsvService) {}

  ngOnInit() {
    this.csvService.loadData('assets/territoires.csv')
      .then(data => {
        this.territoires = data;
        this.territoires.sort((a, b) => a.arrondissement.localeCompare(b.arrondissement));
      });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.interestPointForm.valid) {
      console.log('Form submitted', this.interestPoint);
    }    
  }

  onTypeChange(): void {
    if(this.interestPoint.type !== 'fountain') {
      this.interestPoint.latitude = '';
      this.interestPoint.longitude = '';
    }
  }

  cancel(): void {
    this.interestPoint = {
      name: '',
      address: '',
      postalCode: '',
      district: 1,  
      availability: '',
      type: 'fountain', 
      latitude: '',
      longitude: '',
      remarks: ''
    };
    this.submitted = false;
  }
}