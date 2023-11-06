import { Component, OnInit } from '@angular/core';
import { CsvService } from '../csv.service';
import * as mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';

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
  map!: mapboxgl.Map;
  geoJsonUrl = '../assets/territoires.geojson';
  public arrondissementGeoJson: any;
  public geojsonData: any;

  constructor(private http: HttpClient, private csvService: CsvService) {
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiamJzaW1hcmQiLCJhIjoiY2xvaGV3YnVhMGF1eTJqbzV2a3lzc3FzeCJ9.1arX2YNM65XRaJQB_ewsWA';
  }

  ngOnInit() {
    this.csvService.loadData('assets/fontaines.csv')
      .then(data => {
        this.filteredFontaines = data;
        this.fontaines = data;
      });
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

  onSelectArrondissement(event: Event) {
    this.currentPage = 1
    const selectElement = event.target as HTMLSelectElement;
    const arrondissementId = selectElement.value;
    const feature = this.geojsonData.features.find((f: any) => f.properties.CODEID === +arrondissementId);
    const arrondissement = this.territoires.find((f: any) => f.id === arrondissementId);
    if (arrondissement) {
      this.filteredFontaines = this.fontaines.filter((fontaine: any) => fontaine.Arrondissement === arrondissement.arrondissement);
    } else {
      this.filteredFontaines = this.fontaines;
    }

    if (feature) {
      if (this.map.getLayer('zones-layer-territory')) {
        this.map.removeLayer('zones-layer-territory');
        this.map.removeSource('zones-layer-territory');
      }

      this.map.addSource('zones-layer-territory', {
        type: 'geojson',
        data: feature
      });

      this.map.addLayer({
        id: 'zones-layer-territory',
        type: 'fill',
        source: 'zones-layer-territory',
        paint: {
          'fill-color': '#0080ff',
          'fill-opacity': 0.5
        }
      });

      const bounds = new mapboxgl.LngLatBounds();
      feature.geometry.coordinates[0].forEach((polygon: any) => {
        polygon.forEach((coord: [number, number]) => {
          bounds.extend(coord);
        });
      });
    }
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
}
