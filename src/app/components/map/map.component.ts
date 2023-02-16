import {
  AfterViewInit,
  Component,
  Input,
  NgZone,
  ViewChild,
} from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Subscription } from 'rxjs';
import { TravelProcessService } from 'src/app/services/travel-process.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { filter } from 'rxjs/operators';
import { mapConfig } from './map-config';
import { NavigateHlperService } from 'src/app/services/utils/navigate-hlper.service';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

const BusImage: string = '../../../assets/bus.svg';
const locationImage: string = '../../../assets/location.svg';
const emptyCircleImage: string = '../../../assets/empty-circle.svg';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  private subscriptions: Subscription[] = [];
  @Input() height: string;
  @Input() path: [];
  @Input() nearesStationth: any;
  @Input() stations: any[] = [];
  @Input() showPath: boolean = false;
  @Input() hideBackBtn: boolean = false;
  googleApiLoaded: boolean = false;
  public lat: any;
  public lng: any;
  private followMe: boolean = true;
  private watch: any = null;
  private interval = null;
  private watchMarker = null;
  public markers: any[] = [];
  public stationsMarker: any[] = [];
  public watchmarkers: any[] = [];
  public markerPositions: google.maps.Marker[] = [];
  public polylineOptions: google.maps.PolylineOptions = {};
  public mapOptions: google.maps.MapOptions = {};
  public markerOptions: google.maps.MarkerOptions = {};
  public stationsMarkerOptions: google.maps.MarkerOptions = {};
  public watchmarkerOptions: google.maps.MarkerOptions = {};
  private styles: Record<string, google.maps.MapTypeStyle[]> = {
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
      icon: BusImage,
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
      //paymentTrip
      let routeInfoSubscription = this.showPath
        ? this.travelProcessService.routeInfo
        : this.travelProcessService.paymentTrip;

      this.subscriptions.push(
        routeInfoSubscription.subscribe(
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
        )
      );

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

    this.getUserLocation();
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
  move() {
    this.followMe = false;
  }

  addMarker(latLng) {
    this.markers.push(latLng);
    this.mapOptions.center = latLng;
  }
  addWatchMarker(latLng) {
    this.watchmarkers.push(latLng);
    this.watchMarker = latLng;
    this.followMe
      ? (this.mapOptions.center = new google.maps.LatLng(this.watchMarker))
      : null;
  }

  goToMenu() {
    this.navigateService.goToMenu();
  }

  fixLocation(location: { latitude: number; longitude: number }) {
    if (location) return { lat: location.latitude, lng: location.longitude };
  }
  async getUserLocation() {
    let latLng = await this.getCorentPosition();
    this.removeWatcharkers();
    this.addWatchMarker(latLng.toJSON());
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(async () => {
      latLng = await this.getCorentPosition();
      this.removeWatcharkers();
      this.addWatchMarker(latLng.toJSON());
    }, 10000);
  }
  async getCorentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    return this.ngZone.run(() => {
      return new google.maps.LatLng(
        coordinates.coords.latitude,
        coordinates.coords.longitude
      );
    });
  }

  removeWatcharkers() {
    this.watchmarkers.pop();
    this.watchmarkers = [];
  }

  async centerMap() {
    this.mapOptions.zoom = 16;
    this.watchMarker
      ? (this.mapOptions.center = new google.maps.LatLng(this.watchMarker))
      : null;
    this.followMe = true;
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.stationsMarker = [];
    this.mapOptions.zoom = 13;
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
