import { AfterViewInit, Component, Input } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { MapDirectionsService } from '@angular/google-maps';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  readonly directionsResults$: Observable<
    google.maps.DirectionsResult | undefined
  >;
  @Input() height;
  @Input() path = [];
  markers = [];
  markerPositions: google.maps.Marker[] = [];
  polylineOptions: google.maps.PolylineOptions = {
    strokeColor: '#50c8ff',
    strokeWeight: 6,
  };

  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoom: 16,
  };
  center: google.maps.LatLngLiteral = { lat: 30.79476, lng: 35.18761 };
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
  };
  constructor(private router: Router) {}

  ngAfterViewInit() {
    setTimeout(() => {
      if(this.path.length<2)return;
      this.addMarker(this.path.shift(), 'start');
      this.addMarker(this.path.pop(), 'end');
      this.center = this.path.shift();
      this.printCurrentPosition();
    }, 100);
  }
  markerClick(event) {
    return false;
  }
  printCurrentPosition = async () => {
    if (Capacitor.isNativePlatform()) {
      await Geolocation.requestPermissions().then(
        async () => {
          const coordinates = await Geolocation.getCurrentPosition();

          const latLng = new google.maps.LatLng(
            coordinates.coords.latitude,
            coordinates.coords.longitude
          );
          await this.addMarker(latLng.toJSON(), '');
          this.center = latLng.toJSON();
        },
        async () => {}
      );
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        const latLng = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        this.addMarker(latLng.toJSON(), '');
        this.center = latLng.toJSON();
      });
    }
  };
  async addMarker(latLng, a) {
    console.log(a);
    // this.markerPositions.push(latLng);
    const marker = new google.maps.Marker({
      position: latLng,
      // icon: a=='start'? this.lineSymbol: this.lineSymbol2
    });
    this.markerPositions.push(marker);
    this.markers.push(marker);
    console.log(this.markerPositions);
  }
  removeAllMarkers() {
    this.markerPositions = [];
  }
  goToMenu() {
    this.router.navigate(['/menu']);
  }
}
