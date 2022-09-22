import {
  AfterViewInit,
  Component,
  Input,
  NgZone,
  ViewChild,
} from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { TravelProcessService } from 'src/app/services/travel-process.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { filter } from 'rxjs/operators';
import { mapConfig } from './map-config';
import { NavigateHlperService } from 'src/app/services/utils/navigate-hlper.service';

const BusImage: string = '../../../assets/images/bus.png';
const locationImage: string = '../../../assets/location.svg';
const emptyCircleImage: string = '../../../assets/empty-circle.svg';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  private subscriptions: Subscription[] = [];

  @ViewChild('map') mapRef;
  @Input() height: string;
  @Input() path: [];
  @Input() nearesStationth: any;
  @Input() stations: any[] = [];
  googleApiLoaded: boolean = false;
  public lat: any;
  public lng: any;
  watch: any;
  watchMarker = null;
  markers: any[] = [];
  stationsMarker: any[] = [];
  watchmarkers: any[] = [];
  markerPositions: google.maps.Marker[] = [];
  polylineOptions: google.maps.PolylineOptions = {};
  mapOptions: google.maps.MapOptions = {};
  markerOptions: google.maps.MarkerOptions = {};
  stationsMarkerOptions: google.maps.MarkerOptions = {};
  watchmarkerOptions: google.maps.MarkerOptions = {};
  styles: Record<string, google.maps.MapTypeStyle[]> = {
    default: [],
    silver: mapConfig,
  };
  constructor(
    private navigateService: NavigateHlperService,
    private utils: UtilsService,
    private travelProcessService: TravelProcessService,
    private ngZone: NgZone
  ) {
    const loadgoogleApi = this.utils.apiLoaded.subscribe((res) => {
      this.googleApiLoaded = res;
    });
    this.subscriptions.push(loadgoogleApi);
  }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    this.mapOptions = {
      disableDefaultUI: true,
      zoom: 13,
      center: { lat: 30.79476, lng: 35.18761 },
      styles: this.styles.silver,
    };
    this.watchmarkerOptions = {
      draggable: false,
      icon: locationImage,
    };

    this.markerOptions = {
      draggable: false,
      icon: BusImage,
    };
    this.stationsMarkerOptions = {
      draggable: false,
      icon: emptyCircleImage,
    };
    this.polylineOptions = {
      strokeColor: '#191919',
      strokeWeight: 6,
      strokeOpacity: 1.0,
    };

    setTimeout(() => {
      let routeInfoSubscription = this.travelProcessService.routeInfo.subscribe(
        async (data) => {
          if (!data) return;
          this.path = data.Coordinates;
          this.stations = data.stationArray;
          this.nearesStationth = this.fixLocation(
            data.nearestStation?.stationLocation
          );
          if (this.path && this.path.length >= 2) {
            this.addMarker(this.nearesStationth);
          }
        },
        async (error) => {
          console.log(error);
        }
      );

      this.subscriptions.push(routeInfoSubscription);

      let stationInfo = this.travelProcessService.stationInfo
        .pipe(filter((val) => val !== null))
        .subscribe(
          async (res) => {
            let thisStation = this.stations.find(
              ({ stationIndex }) => stationIndex === +res
            );
            if (thisStation) {
              this.creatStationMarker(thisStation);
            }
          },
          async (error) => {
            console.log(error);
          }
        );
      this.subscriptions.push(stationInfo);
    }, 100);

    this.printCurrentPosition();
  }
  creatStationMarker(obj) {
    this.stationsMarker = [];
    const latLng = {
      lat: obj.stationLocation.lat,
      lng: obj.stationLocation.lon,
    };
    this.stationsMarker.push(latLng);
    this.mapOptions.center = latLng;
    this.mapOptions.zoom = 16;
  }

  printCurrentPosition = async () => {
    let latLng;
    if (Capacitor.isNativePlatform()) {
      await Geolocation.requestPermissions().then(async () => {
        this.watch = Geolocation.watchPosition({}, (position, err) => {
          this.ngZone.run(() => {
            latLng = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
          });
          this.removeWatcharkers();
          this.addWatchMarker(latLng.toJSON());
        });
      });
    } else {
      this.watch = Geolocation.watchPosition({}, (position, err) => {
        if (position) {
          console.log(position);
          this.ngZone.run(() => {
            latLng = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
          });
          this.removeWatcharkers();
          this.addWatchMarker(latLng.toJSON());
        } else {
          console.log(err);
        }
      });
    }
  };
  addMarker(latLng) {
    this.markers.push(latLng);
    this.mapOptions.center = latLng;
  }
  addWatchMarker(latLng) {
    this.watchmarkers.push(latLng);
    if (!(this.nearesStationth.lat && this.nearesStationth.lng))
      this.mapOptions.center = latLng;
  }

  goToMenu() {
    this.navigateService.goToMenu();
  }

  fixLocation(location: { latitude: number; longitude: number }) {
    if (location) return { lat: location.latitude, lng: location.longitude };
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.stopTrack();
    this.stationsMarker = [];
    this.mapOptions.zoom = 13;
  }
  removeWatcharkers() {
    this.watchmarkers.pop();
    this.watchmarkers = [];
  }
  async stopTrack() {
    const opt = { id: await this.watch };
    Geolocation.clearWatch(opt).then((result) => {
      console.log('result of clear is', result);
    });
  }
}
