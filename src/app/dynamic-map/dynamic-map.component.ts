import { Component, OnInit, OnDestroy } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-dynamic-map',
  templateUrl: './dynamic-map.component.html',
  styleUrls: ['./dynamic-map.component.css'],
})
export class DynamicMapComponent implements OnInit, OnDestroy {
  map!: mapboxgl.Map;

  ngOnInit() {
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiamJzaW1hcmQiLCJhIjoiY2xvaGV3YnVhMGF1eTJqbzV2a3lzc3FzeCJ9.1arX2YNM65XRaJQB_ewsWA';
    this.map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-73.56, 45.5], // starting position [lng, lat]
      zoom: 10  , // starting zoom
    });
  }

  ngOnDestroy() {
    this.map.remove(); // This will ensure the map is properly destroyed if the component is removed from the DOM.
  }
}
