import { CSP_NONCE, Component, Input, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CsvService } from '../csv.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interet',
  templateUrl: './interet.component.html',
  styleUrls: ['./interet.component.css']
})
export class InteretComponent implements OnInit {
  public fontaines: any[] = [];
  public filteredFontaines: any[] = [];
  public territoires: any[] = [];
  public currentPage: number = 1;
  @Input() maxSize: number = 1;
  map!: mapboxgl.Map;
  geoJsonUrl = '../assets/territoires.geojson';
  public arrondissementGeoJson: any;
  public geojsonData: any;
  showActionMenu = false;

  public type: string = '';
  public territoire: string = ''; 
  public nom: string | null = null;
  selectedRowIndex: number | null = null;

  constructor(private http: HttpClient, private csvService: CsvService, private router: Router) {
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiamJzaW1hcmQiLCJhIjoiY2xvaGV3YnVhMGF1eTJqbzV2a3lzc3FzeCJ9.1arX2YNM65XRaJQB_ewsWA';
  }

  ngOnInit() {
    this.loadTerritoires();
    this.loadPointsOfInterest();
  }

  loadPointsOfInterest(page: number = this.currentPage, limite: number = 10): void {
    this.selectedRowIndex = null;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limite', limite.toString());

    if (this.type) params = params.set('type', this.type);
    if (this.territoire) params = params.set('territoire', this.territoire);
    if (this.nom) params = params.set('nom', this.nom);

    this.http.get('http://localhost:8080/gti525/v1/pointsdinteret', { params }).subscribe(
      (response: any) => {
        this.maxSize = response.totalPages;
        this.currentPage = response.currentPage;
        this.fontaines = response.pointsDInteret.map((point: any) => {
          return {
            ...point,
            Type: point.Etat === "" ? "Fontaine à boire" : "Atelier réparation"
          };
        });
        this.filteredFontaines = this.fontaines;
      },
      error => {
        console.error('Could not load points of interest data:', error);
      }
    );
  }

  private loadTerritoires(): void {
    this.csvService.loadData('assets/territoires.csv')
    .then(data => {
      this.territoires = data;
      this.territoires.sort((a, b) => a.arrondissement.localeCompare(b.arrondissement));
      this.loadGeoJsonData();
      this.initializeMap();
    });
  }

  private loadGeoJsonData() {
    this.http.get(this.geoJsonUrl).subscribe(
      (data: any) => {
        this.geojsonData = data;
      },
      error => {
        console.error('Could not load GeoJSON data:', error);
      }
    );
  }

  private initializeMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-73.6983, 45.5517],
      zoom: 8.7
    });

    this.map.on('load', () => {
      this.map.addSource('zones', {
        type: 'geojson',
        data: this.geoJsonUrl
      });

      this.map.addLayer({
        id: 'zones-layer',
        type: 'fill',
        source: 'zones',
        layout: {},
        paint: {
          'fill-color': '#9d9d9d',
          'fill-opacity': 0.5
        }
      });
    });
  }

  onSelectArrondissement(event: Event) {
    this.currentPage = 1;
    const selectElement = event.target as HTMLSelectElement;
    const arrondissementId = selectElement.value;
    const feature = this.geojsonData.features.find((f: any) => f.properties.CODEID === +arrondissementId);
  
    if (feature) {
      this.updateMapToFeature(feature);
    } else{
      this.initializeMap();
    }

    const selectedText = selectElement.options[selectElement.selectedIndex].text;
    this.territoire = selectedText === "Tous" ? "" : selectedText;
  
    this.loadPointsOfInterest(this.currentPage, 10);
  }

  private updateMapToFeature(feature: any): void {
  const greyOctagonLayerId = 'zones-layer';

  if (this.map.getLayer(greyOctagonLayerId)) {
    this.map.removeLayer(greyOctagonLayerId);
  }

  const arrondissementLayerId = 'zones-layer-territory';

  if (this.map.getLayer(arrondissementLayerId)) {
    this.map.removeLayer(arrondissementLayerId);
    this.map.removeSource(arrondissementLayerId);
  }

  this.map.addSource(arrondissementLayerId, {
    type: 'geojson',
    data: feature
  });

  this.map.addLayer({
    id: arrondissementLayerId,
    type: 'fill',
    source: arrondissementLayerId,
    paint: {
      'fill-color': '#0080ff',
      'fill-opacity': 0.5
    }
  });

  }

  onSelectType(event: Event) {
    this.currentPage = 1; 
    const selectElement = event.target as HTMLSelectElement;
    const selectedText = selectElement.value;
    this.type = selectedText === "Tous" ? "" : selectedText;
    this.loadPointsOfInterest();
  }

  selectRow(index: number): void {
    this.selectedRowIndex = this.selectedRowIndex === index ? null : index;
  }
  
  isSelectedRow(index: number): boolean {
    return index === this.selectedRowIndex;
  }  

  getPaginationNumbers() {
    let startPage: number, endPage: number;
    if (this.maxSize <= 5) {
      startPage = 1;
      endPage = this.maxSize;
    } else {
      if (this.currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (this.currentPage + 1 >= this.maxSize) {
        startPage = this.maxSize - 4;
        endPage = this.maxSize;
      } else {
        startPage = this.currentPage - 2;
        endPage = this.currentPage + 2;
      }
    }
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);
    return pages;
  }
  

  editPointOfInterest() {
    if (this.selectedRowIndex != null) {
      const pointId = this.filteredFontaines[this.selectedRowIndex].ID;
      this.router.navigate(['/ajouter-interet', pointId]);
    } else {
      console.log('No row selected');
    }
  }
  
  deletePointOfInterest() {
    if (this.selectedRowIndex != null) {
      const pointId = this.filteredFontaines[this.selectedRowIndex].ID;
      console.log(pointId);
      this.http.delete(`http://localhost:8080/gti525/v1/pointsdinteret/${pointId}`)
        .subscribe(
          response => {
            console.log('Point of interest deleted successfully');
            this.loadPointsOfInterest();
          },
          error => console.error('Error deleting point of interest:', error)
        );
    } else {
      console.log('No row selected');
    }
  }
  
  toggleActionMenu(): void {
    this.showActionMenu = !this.showActionMenu;
  }

}
