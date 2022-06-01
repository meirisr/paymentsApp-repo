import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  @ViewChild('map')
  mapRef: ElementRef<HTMLElement>;
  newMap: GoogleMap;
  lat: number;
  lng: number;
  mapActive = false;
  markerId: string;
  markers: string[] = [];
  constructor(private alertController: AlertController) {}

  ngOnInit() {}
  ionViewDidEnter() {
    this.createMap();
    this.mapActive = true;
  }
  ionViewDidLeave() {
    this.newMap.destroy();
    this.mapActive = false;
  }
  async createMap() {
    this.newMap = await GoogleMap.create({
      id: 'my-map',
      element: this.mapRef.nativeElement,
      apiKey: 'AIzaSyBRSDJlrypvSieVkBJbz3YlL7SA-DF3p3Q',
      config: {
        center: {
          lat: 33.6,
          lng: -117.9,
        },
        zoom: 16,
      },
    });
    this.newMap.enableTrafficLayer(true);
  }

  printCurrentPosition = async () => {
    if (Capacitor.isNativePlatform()) {
      Geolocation.requestPermissions().then(async () => {
        const coordinates = await Geolocation.getCurrentPosition();
        this.lat = coordinates.coords.latitude;
        this.lng = coordinates.coords.longitude;
        this.addMarker(this.lat, this.lng);
      });
    } else {
      const coordinates = await Geolocation.getCurrentPosition();
      this.lat = coordinates.coords.latitude;
      this.lng = coordinates.coords.longitude;
      this.addMarker(this.lat, this.lng);
    }
    this.addListenerrs();
  };
  async addMarker(lat: number, lng: number) {
    this.markerId = await this.newMap.addMarker({
      coordinate: {
        lat,
        lng,
      },
      draggable: true,
    });
    this.markers.push(this.markerId);
    console.log(this.markers);
    this.newMap.setCamera({
      coordinate: {
        lat,
        lng,
      },
    });
  }
  async removeMarker(marker) {
    await this.newMap.removeMarker(marker);
    this.markers = this.markers.filter((mark) => mark !== marker);
  }
  async removeAllMarker() {
    if (this.markers.length > 0) {
      await this.newMap.removeMarkers(this.markers);
      this.markers = [];
    }
  }
  async addListenerrs() {
    await this.newMap.setOnMarkerClickListener((event) => {
      console.log(event);
    });
  }
}
