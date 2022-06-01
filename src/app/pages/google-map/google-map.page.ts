import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.page.html',
  styleUrls: ['./google-map.page.scss'],
})
export class GoogleMapPage implements OnInit {
  apiLoaded: boolean;
  markers=[];
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild('map') mapRef: ElementRef<HTMLElement>;
  center: google.maps.LatLngLiteral = { lat: 31.79476, lng: 35.18761 };
  zoom = 16;
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    clickable: true,
  };
  markerPositions: google.maps.LatLngLiteral[] = [];
  constructor(private httpClient: HttpClient) {
    const key = environment.googleMapsKey;
    httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${key}&language=he`,
        'callback'
      )
      .pipe(
        map(() => true),
        catchError(() => of(false))
      )
      .subscribe((result) => (this.apiLoaded = result));
  }

  ngOnInit() {}
  // addMarker(event: google.maps.MapMouseEvent) {

  //   this.markerPositions.push(event.latLng.toJSON());
  // }
  moveMap(event: google.maps.MapMouseEvent) {
    this.center = event.latLng.toJSON();
  }
  markerClick(event) {
    console.log(event);
  }

  printCurrentPosition = async () => {
    if (Capacitor.isNativePlatform()) {
      Geolocation.requestPermissions().then(async () => {
        const coordinates = await Geolocation.getCurrentPosition();

        const latLng = new google.maps.LatLng(
          coordinates.coords.latitude,
          coordinates.coords.longitude
        );
        this.addMarker(latLng);
      });
    } else {
      const coordinates = await Geolocation.getCurrentPosition();
      const latLng = new google.maps.LatLng(
        coordinates.coords.latitude,
        coordinates.coords.longitude
      );
      this.addMarker(latLng);
    }
  };
  addMarker(latLng: google.maps.LatLng) {
    this.markerPositions.push(latLng.toJSON());
    this.center = latLng.toJSON();
   const marker= new google.maps.Marker({
      position: latLng.toJSON(),
      // map: this.mapRef,
    });
    this.markers.push(marker);
    this.markerPositions.push(marker.getPosition().toJSON());
    console.log(this.markers);
  }
  removeAllMarkers() {
    this.markerPositions = [];
  }
}
