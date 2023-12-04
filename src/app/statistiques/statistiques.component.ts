import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CsvService } from '../csv.service';
import * as mapboxgl from 'mapbox-gl';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-statistiques',
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.css'],
})
export class StatistiquesComponent implements OnInit {
  public records: any[] = [];
  public currentPage: number = 1;
  public isModalVisible: boolean = false;
  public selectedPointData: any = null;
  currentSortField: string = 'ID';
  sortDirection: 'asc' | 'desc' = 'asc';
  searchTerm: string = '';
  filteredRecords: any[] = [];
  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11'; // your style URL
  lat = 45.5017; // default latitude
  lng = -73.5673; // default longitude

  constructor(
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.apiService
      .loadData('http://localhost:8080/gti525/v1/compteurs?limite=10000')
      .subscribe(
        (data) => {
          this.records = data;
          this.filteredRecords = [...this.records];
        },
        (error) => {
          console.error('Error fetching data: ', error);
        }
      );
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  searchRecords() {
    this.apiService
      .loadDataWithParams('http://localhost:8080/gti525/v1/compteurs', {
        limite: 10,
        nom: this.searchTerm,
      })
      .subscribe(
        (data) => {
          this.filteredRecords = data;
          console.log(this.filterRecords);

        },
        (error) => {
          console.error('Error fetching data: ', error);
        }
      );
  }
  private convertToGeoJSON(
    records: any[]
  ): GeoJSON.FeatureCollection<GeoJSON.Point> {
    return {
      type: 'FeatureCollection',
      features: records.map((record) => ({
        type: 'Feature',
        properties: {
          ID: record.ID,
          Nom: record.Nom,
          Statut: record.Statut,
          Annee_implante: record.Annee_implante,
        },
        geometry: {
          type: 'Point',
          coordinates: [
            parseFloat(record.Longitude),
            parseFloat(record.Latitude),
          ],
        },
      })),
    };
  }

  private initializeMap() {
    if (this.map) return;

    (mapboxgl as any).accessToken =
      'pk.eyJ1IjoiamJzaW1hcmQiLCJhIjoiY2xvaGV3YnVhMGF1eTJqbzV2a3lzc3FzeCJ9.1arX2YNM65XRaJQB_ewsWA';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 12,
      center: [this.lng, this.lat],
    });

    this.map.on('load', () => {
      const geojsonData = this.convertToGeoJSON(this.records);
      this.map.addSource('points', {
        type: 'geojson',
        data: geojsonData,
      });
      this.map.addLayer({
        id: 'points',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-radius': 8,
          'circle-color': '#007cbf',
        },
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      this.map.on('mouseenter', 'points', (e) => {
        if (e.features?.length) {
          this.map.getCanvas().style.cursor = 'pointer';

          const feature = e.features[0];
          if (feature.geometry.type === 'Point') {
            const coordinates = feature.geometry.coordinates as [
              number,
              number
            ];
            const description = feature.properties?.['Nom'] ?? '';

            popup
              .setLngLat(coordinates)
              .setHTML(`<strong>${description}</strong>`)
              .addTo(this.map);

            // Set the hovered feature paint property using the feature's layer and source.
            this.map.setPaintProperty('points', 'circle-color', [
              'case',
              ['==', ['get', 'ID'], feature.properties?.['ID']],
              '#ff0000',
              '#007cbf',
            ]);
          }
        }
      });

      this.map.on('mouseleave', 'points', () => {
        this.map.getCanvas().style.cursor = '';
        popup.remove();
        this.map.setPaintProperty('points', 'circle-color', '#007cbf');
      });

      this.map.on('click', 'points', (e) => {
        if (e.features?.length) {
          const feature = e.features[0];
          if (feature.geometry.type === 'Point') {
            this.selectedPointData = {
              ID: feature.properties?.['ID'],
              Nom: feature.properties?.['Nom'],
              Statut: feature.properties?.['Statut'],
              Annee_implante: feature.properties?.['Annee_implante'],
            };
            // Open the modal
            this.isModalVisible = true;
            this.changeDetectorRef.detectChanges();
          }
        }
      });
    });
  }

  currentView: 'list' | 'map' = 'list';

  toggleView(view: 'list' | 'map'): void {
    this.currentView = view;
    if (view === 'map') {
      setTimeout(() => this.initializeMap(), 0);
    }
  }

  filterRecords() {
    if (this.searchTerm) {
      this.filteredRecords = this.records.filter((record) =>
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
