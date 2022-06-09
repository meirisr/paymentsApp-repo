import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.page.html',
  styleUrls: ['./google-map.page.scss'],
})
export class GoogleMapPage implements OnInit, AfterViewInit {
  @ViewChild('polyline') polylineRef: ElementRef<HTMLElement>;
  @ViewChild('map') mapRef: ElementRef<HTMLElement>;
  unsubscribe = new Subject<void>();
  apiLoaded = false;
  lineSymbol = {
    path: 'M -2,0 0,-2 2,0 0,2 z',
    strokeColor: '#F00',
    fillColor: '#F00',
    fillOpacity: 1,
  };
  markers = [];
  vertices = {
    path: [
      { lat: 13, lng: 13 },
      { lat: -13, lng: 0 },
      { lat: 13, lng: -13 },
    ],
    icons: [
      {
        icon: this.lineSymbol,
        offset: '100%',
      },
    ],
  };

  markerPositions: google.maps.LatLngLiteral[] = [
    { lat: 13, lng: 13 },
    { lat: -13, lng: 0 },
    { lat: 13, lng: -13 },
  ];


  mapOptions: google.maps.MapOptions = {
    center: { lat: 31.79476, lng: 35.18761 },
    zoom: 16,
  };
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    clickable: true,
    icon: {
      url:'../../../assets/isr-logo-black.svg' ,
      scale:2,
    },
    // icon:{
    //   url: location ? this.homeicon : this.icon,
    //   scaledSize: { height: 35, width: 25 },
    // }
  };

  constructor(private httpClient: HttpClient) {
    const key = environment.googleMapsKey;
    this.httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${key}&language=en`,
        'callback'
      )
      .pipe(
        map(() => true),
        catchError(() => of(false))
      )
      .subscribe((result) => {
        this.apiLoaded = result;
      });
  }

  ngOnInit() {}

  ngAfterViewInit() {
   setTimeout(()=>{
    this.printCurrentPosition();
   },100);
  }

  moveMap(event: google.maps.MapMouseEvent) {
    this.mapOptions.center = event.latLng.toJSON();
  }
  markerClick(event) {
    console.log(event);
  }

  printCurrentPosition = async () => {
    if (Capacitor.isNativePlatform()) {
      await Geolocation.requestPermissions().then(async () => {
        const coordinates = await Geolocation.getCurrentPosition();

        const latLng = new google.maps.LatLng(
          coordinates.coords.latitude,
          coordinates.coords.longitude
        );
        await this.addMarker(latLng);
      });
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        const latLng = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        this.addMarker(latLng);
      });
      // await Geolocation.getCurrentPosition().then(
      //   async (coordinates) => {
      //     const latLng = new google.maps.LatLng(
      //       coordinates.coords.latitude,
      //       coordinates.coords.longitude
      //     );
      //     await this.addMarker(latLng);
      //   }
      // );
    }
  };
  async addMarker(latLng: google.maps.LatLng) {
    this.markerPositions.push(latLng.toJSON());
    this.mapOptions.center = latLng.toJSON();
    const marker = new google.maps.Marker({
      position: latLng.toJSON(),
    });
    this.markers.push(marker);
    // this.markerPositions.push(marker.getPosition().toJSON());
    console.log(this.markers);
  }
  removeAllMarkers() {
    this.markerPositions = [];
  }
}
