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
    
    // Define path types and their corresponding colors
    const pathCategories = {
      REV: {
        revAvancementCodes: ['EV', 'PE', 'TR'],
        color: '#2AC7DD' 
      },
      shared: {
        avancementCodes: ['E'],
        typeVoieCodes: ['1', '3', '8', '9'],
        color: '#84CA4B' 
      },
      protected: {
        avancementCodes: ['E'],
        revAvancementCodes: ['EV', 'PE', 'TR'],
        typeVoieCodes: ['4', '5', '6', '7'],
        color: '#025D29' 
      },
      polyvalent: {
        avancementCodes: ['E'],
        typeVoieCodes: ['7'],
        color: '#B958D9'
      }
    };
    
    // Filter the features into categories
    const filterFeaturesByCategory = (features : any[], category : any) => {
      return features.filter(feature => {
        const props = feature.properties;
        //Check if filtering for shared and polyvalent paths
        if (category === pathCategories.shared || category === pathCategories.polyvalent) {
          return props &&
            category.avancementCodes.includes(props.AVANCEMENT_CODE) &&
            category.typeVoieCodes.includes(props.TYPE_VOIE_CODE);
        }
        // Check for REV paths
        if (category === pathCategories.REV) {
          return props && category.revAvancementCodes.includes(props.REV_AVANCEMENT_CODE);
        }
        // Check for protected paths
        if (category === pathCategories.protected) {
          return props &&
            category.avancementCodes.includes(props.AVANCEMENT_CODE) &&
            category.typeVoieCodes.includes(props.TYPE_VOIE_CODE) &&
            !category.revAvancementCodes.includes(props.REV_AVANCEMENT_CODE);
        }
      });
    };

    // Function to add a category of paths to the map 
    const addCategoryPathsToMap = (path: any[], color: string, index: number) => {
      if (path && this.sourceLoaded) {
        const sourceId = `path-source-${index}`; 
        const layerId = `path-layer-${index}`; 
         
        if (this.map.getLayer(layerId)) {
          console.log("remove itm1")
          this.map.removeLayer(layerId);
        }
        if (this.map.getSource(sourceId)) {
          console.log("remove it")
          this.map.removeSource(sourceId);
        }
      
        this.map.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: path,
          },
        });

        this.map.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {},
          paint: {
            'line-color': color,
            'line-width': 5,
           },
        });
      }
    };

    // Filter features for each category
    const REVPaths = filterFeaturesByCategory(this.bikePaths, pathCategories.REV);
    const sharedPaths = filterFeaturesByCategory(this.bikePaths, pathCategories.shared);
    const protectedPaths = filterFeaturesByCategory(this.bikePaths, pathCategories.protected);
    const polyvalentPaths = filterFeaturesByCategory(this.bikePaths, pathCategories.polyvalent);

    // Add paths to the map for each category
    addCategoryPathsToMap(protectedPaths, pathCategories.protected.color, 0);
    addCategoryPathsToMap(sharedPaths, pathCategories.shared.color , 1);
    addCategoryPathsToMap(REVPaths, pathCategories.REV.color, 2);
    addCategoryPathsToMap(polyvalentPaths, pathCategories.polyvalent.color, 3);
}

  ngOnDestroy() {
    this.map.remove();
  }
}
