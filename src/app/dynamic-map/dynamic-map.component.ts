import { Component, OnInit, OnDestroy, Input, SimpleChanges } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dynamic-map',
  templateUrl: './dynamic-map.component.html',
  styleUrls: ['./dynamic-map.component.css'],
})
export class DynamicMapComponent implements OnInit, OnDestroy {
  @Input() seasonType: string = "Saisonnier";
  @Input() showProtectedPaths: boolean = true;
  @Input() showSharedPaths: boolean = true;

  private readonly API_URL = 'http://localhost:8080/gti525/v1/pistes';
  map!: mapboxgl.Map;
  sourceLoaded: boolean = false;
  bikePaths: any[] = [];
  isActiveSeason: boolean = true; 

  constructor(private http: HttpClient) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['seasonType'] || changes['showProtectedPaths'] || changes['showSharedPaths']) {
      this.updateMapForSeason();
    }
  }

  updateMapForSeason(): void {
    this.isActiveSeason = this.seasonType === 'Saisonnier';
    if (this.sourceLoaded) {
      this.loadBikePaths();
    }
  }

  ngOnInit() {
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiamJzaW1hcmQiLCJhIjoiY2xvaGV3YnVhMGF1eTJqbzV2a3lzc3FzeCJ9.1arX2YNM65XRaJQB_ewsWA';
    this.map = new mapboxgl.Map({
      container: 'map', 
      style: 'mapbox://styles/mapbox/streets-v12', 
      center: [-73.56, 45.5],
      zoom: 10, 
    });

    this.map.on('load', () => {
      this.sourceLoaded = true;
      this.loadBikePaths();
    });
  }

  loadBikePaths() {
    this.http.get<any[]>(this.API_URL).subscribe(data => {
      this.bikePaths = this.filterForActiveSeason(data);
      this.addPaths();
    });
  }

  filterForActiveSeason(featureCollection: any) {  
    let filteredFeatures = featureCollection.features;

    const showProtected = this.showProtectedPaths;
    const showShared = this.showSharedPaths;

    if (showProtected && !showShared) {
      // Filter for protected paths
      console.log(filteredFeatures)
      filteredFeatures = filteredFeatures.filter((feature: any) =>
        feature.properties && (
          feature.properties.TYPE_VOIE_CODE === '4' || 
          feature.properties.TYPE_VOIE_CODE === '5' || 
          feature.properties.TYPE_VOIE_CODE === '6' || 
          feature.properties.TYPE_VOIE_CODE === '7'
        )   
      );
    } else if (!showProtected && showShared) {
      // Filter for shared paths
      filteredFeatures = filteredFeatures.filter((feature: any) =>
        feature.properties && (
          feature.properties.TYPE_VOIE_CODE === '1' || 
          feature.properties.TYPE_VOIE_CODE === '3' || 
          feature.properties.TYPE_VOIE_CODE === '8' || 
          feature.properties.TYPE_VOIE_CODE === '9'
        )
      );
    }

    // When the season is not "Saisonnier", filter paths with property 'SAISONS4' set to 'Oui'
    if (this.seasonType !== "Saisonnier") {
       filteredFeatures = filteredFeatures.filter((feature: any) =>
       feature.properties && feature.properties.SAISONS4 === 'Oui'
       );
    } 
  
     return filteredFeatures;
  }
 

  private addPaths() {
    console.log(this.bikePaths);
    if (this.bikePaths && this.sourceLoaded) {
      if (this.map.getSource('paths')) {
        (this.map.getSource('paths') as mapboxgl.GeoJSONSource).setData({
          type: 'FeatureCollection',
          features: this.bikePaths,
        });
      } else {
        this.map.addSource('paths', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: this.bikePaths,
          },
        });

        this.map.addLayer({
          id: 'paths',
          type: 'line',
          source: 'paths',
          layout: {},
          paint: {
            'line-color': '#ff0000',
            'line-width': 5,
          },
        });
      }
    }
  }

  ngOnDestroy() {
    this.map.remove(); 
  }
}
