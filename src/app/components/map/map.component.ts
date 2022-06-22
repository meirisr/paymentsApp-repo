import { Component, OnInit } from '@angular/core';
import {GoogleMapsModule} from '@angular/google-maps';




@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  center: google.maps.LatLngLiteral = {lat: 24, lng: 12};
  zoom = 4;
  constructor() { }

  ngOnInit() {}

}
