import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CsvService } from '../csv.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ajouter-interets',
  templateUrl: './ajouter-interets.component.html',
  styleUrls: ['./ajouter-interets.component.css']
})
export class AjouterInteretsComponent {
  public territoires: any[] = [];
  public submitted = false;
  successMessage: string = '';
  errorMessage: string = '';
  @ViewChild('interestPointForm') interestPointForm!: NgForm;
  @ViewChild('districtSelect')
  districtSelect!: ElementRef;
  public interestPoint: any = {
    name: '',
    address: '',
    postalCode: '',
    arrondissementText: 'Dorval',
    availability: '',
    type: 'fountain', 
    latitude: '',
    longitude: '',
    remarks: ''
  };
  mode: 'add' | 'edit' = 'add';
  @Input() editingInterestPointId: number | null = null;


  constructor(private http: HttpClient, private csvService: CsvService, private route: ActivatedRoute) {}

  ngOnInit() {
      this.csvService.loadData('assets/territoires.csv')
      .then(data => {
        this.territoires = data;
        this.territoires.sort((a, b) => a.arrondissement.localeCompare(b.arrondissement));
      });
      this.route.params.subscribe(params => {
        if (params['editingInterestPointId']) {
          this.editingInterestPointId = params['editingInterestPointId'];
        }
      });
      this.checkEditMode();
  }

  checkEditMode() {
    if (this.editingInterestPointId != null) {
      this.mode = 'edit';
      this.http.get(`http://localhost:8080/gti525/v1/pointsdinteret/${this.editingInterestPointId}`)
        .subscribe({
          next: (response: any) => {
            this.populateFormWithData(response);
          },
          error: (error) => {
            console.error('Error fetching point of interest:', error);
            this.errorMessage = 'Error occurred while fetching Point of Interest for editing.';
          }
        });
    }    
  }

  populateFormWithData(data: any) {
    this.interestPoint = {
      name: data.Nom_parc_lieu,
      address: data.Intersection,
      arrondissementText: data.Arrondissement,
      availability: data.Date_installation,
      type: data.Etat === '' ? 'fountain' : 'Atelier réparation',
      latitude: data.Latitude,
      longitude: data.Longitude,
      remarks: data.Remarque,
      date: data.Date_installation
    };
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.interestPointForm.valid) {
      const postData = this.preparePostData();
      if (this.mode === 'add') {
        this.addPointOfInterest(postData);
      } else {
        this.editPointOfInterest(postData);
      }
    }
  }

  preparePostData() {
    const postData = {
      Etat: this.interestPoint.type === 'fountain' ? '' : 'Atelier réparation',
      Proximite_jeux_repere: '', 
      Arrondissement: this.interestPoint.arrondissementText,
      Remarque: this.interestPoint.remarks,
      Nom_parc_lieu: this.interestPoint.name,
      Longitude: this.interestPoint.longitude,
      Latitude: this.interestPoint.latitude,
      Date_installation: this.interestPoint.availability,
      Intersection: this.interestPoint.address,
      Precision_localisation: '',
      ID : this.editingInterestPointId
      };
    if (this.mode === 'add') {
      postData['ID'] = this.generateRandomId();
    }
    return postData;
  }

  addPointOfInterest(postData: any) {
    this.http.post('http://localhost:8080/gti525/v1/pointsdinteret', postData)
      .subscribe({
        next: (response) => {
          this.handleSuccessResponse('Point of Interest has been added successfully!');
        },
        error: (error) => {
          this.handleErrorResponse('Error occurred while adding Point of Interest.');
        }
      });
  }

  editPointOfInterest(postData: any) {
    if (this.editingInterestPointId) {
      console.log(postData);
      this.http.patch(`http://localhost:8080/gti525/v1/pointsdinteret/${this.editingInterestPointId}`, postData)
        .subscribe({
          next: (response) => {
            this.handleSuccessResponse('Point of Interest has been updated successfully!');
          },
          error: (error) => {
            this.handleErrorResponse('Error occurred while updating Point of Interest.');
          }
        });
    }
  }

  handleSuccessResponse(message: string) {
    this.successMessage = message;
    this.errorMessage = '';
    this.cancel();
  }

  handleErrorResponse(message: string) {
    this.errorMessage = message;
    this.successMessage = '';
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
      arrondissementText: 'Dorval',
      availability: '',
      type: 'fountain', 
      latitude: '',
      longitude: '',
      remarks: ''
    };
    this.submitted = false;
  }

  generateRandomId(): number {
    const randomPart = Math.floor(Math.random() * 1000000); 
    return randomPart;
  }
}