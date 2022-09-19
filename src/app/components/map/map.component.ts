import {
  AfterViewInit,
  Component,
  Input,
  NgZone,
  ViewChild,
} from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { Observable, Subscription } from 'rxjs';
import { MenuController, NavController } from '@ionic/angular';
import { TravelProcessService } from 'src/app/services/travel-process.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

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

  // @ViewChild('map') mapRef;
  @Input() height: string;
  @Input() path: [];
  @Input() nearesStationth;
  @Input() stations: any[] = [];
  googleApiLoaded: boolean = false;
  public lat: any;
  public lng: any;
  watch: any;
  bounds;
  watchMarker = null;
  markers = [];
  stationsMarker = [];
  watchmarkers = [];
  markerPositions: google.maps.Marker[] = [];
  polylineOptions: google.maps.PolylineOptions = {};
  mapOptions: google.maps.MapOptions = {};
  markerOptions: google.maps.MarkerOptions = {};
  stationsMarkerOptions: google.maps.MarkerOptions = {};
  watchmarkerOptions: google.maps.MarkerOptions = {};
  styles: Record<string, google.maps.MapTypeStyle[]> = {
    default: [],
    silver: [
      {
        elementType: 'geometry',
        stylers: [{ color: '#f5f5f5' }],
      },
      {
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }],
      },
      {
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9e9e9e' }],
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#f5f5f5' }],
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#bdbdbd' }],
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{ color: '#eeeeee' }],
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#757575' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#e5e5e5' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9e9e9e' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }],
      },
      {
        featureType: 'road.arterial',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9e9e9e' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#dadada' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9e9e9e' }],
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9e9e9e' }],
      },
      {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [{ color: '#e5e5e5' }],
      },
      {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [{ color: '#eeeeee' }],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#d4f1f9' }],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9e9e9e' }],
      },
    ],
  };
  constructor(
    private navCtrl: NavController,
    private utils: UtilsService,
    private menuCtrl: MenuController,
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
   let stationInfo = this.travelProcessService.stationInfo.subscribe(async(res) =>{
      console.log(res)
      console.log("gggggggg")
      let thisStation=this.stationsMarker.find((obj)=>{obj.stationIndex==res})
      this.creatStationMarker(thisStation)
    
    });
    this.subscriptions.push(stationInfo);
  }

  initMap() {
    this.mapOptions = {
      disableDefaultUI: true,
      zoom: 12,
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
    // console.log(this.mapRef);

    setTimeout(() => {
      let routeInfoSubscription = this.travelProcessService.routeInfo.subscribe(
        async (data) => {
          if (!data) return;

          this.path = data.Coordinates;
          this.nearesStationth = this.fixLocation(
            data.nearestStation?.stationLocation
          );
          if (this.path && this.path.length >= 2) {
            this.addMarker(this.nearesStationth);
            // data.stationArray.forEach((obj) => {
            //   this.creatStationMarker(obj);
            // });
          }
        },
        async (error) => {
          console.log(error);
        }
      );

      this.subscriptions.push(routeInfoSubscription);
    }, 100);
    // console.log(this.mapRef._elementRef)
    //  this.map= new google.maps.Map(this.mapRef.nativeElement,this.mapOptions)

    this.printCurrentPosition();
  }
  creatStationMarker(obj) {
    console.log(obj)
    this.stationsMarker=[];
    const latLng={lat:obj.stationLocation.lat,lng:obj.stationLocation.lon}
    this.stationsMarker.push(latLng);
    this.mapOptions.center = latLng;
  }
  markerClick() {
    return false;
  }

  moveMap(event: google.maps.MapMouseEvent) {
    // this.center = (event.latLng.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
    // this.display = event.latLng.toJSON();
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
      // async () => {
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
          //  this.markers.push(latLng.toJSON());
          //  console.log(this.nearesStationth)

          console.log(this.markers);
          // this.map.panTo(latLng.toJSON());
        } else {
          console.log(err);
        }
      });
      // }
      // navigator.geolocation.getCurrentPosition((position) => {
      //  this.ngZone.run(() => {
      //       latLng= new google.maps.LatLng(
      //         position.coords.latitude,
      //         position.coords.longitude
      //       );
      //     })
      //   this.addMarker(latLng.toJSON(), 'location');
      //   this.map.panTo(latLng.toJSON());

      //   // this.bounds.extend(latLng);
      //   // this.map.center.center = latLng.toJSON();

      // });
    }
  };
  addMarker(latLng) {
    this.markers.push(latLng);
    this.mapOptions.center = latLng;
    // const marker = new google.maps.Marker({

    //   position: latLng,
    //   icon: a =='location'?image: ''
    // });
    // marker.setMap(this.map)
    // return marker;
    // this.markerPositions.push(marker);
    // this.markers.push(marker);
    // this.map.center=marker.getPosition()
  }
  addWatchMarker(latLng) {
    this.watchmarkers.push(latLng);
    this.mapOptions.center = latLng;

    // const marker = new google.maps.Marker({

    //   position: latLng,
    //   icon: a =='location'?image: ''
    // });
    // marker.setMap(this.map)
    // return marker;
    // this.markerPositions.push(marker);
    // this.markers.push(marker);
    // this.map.center=marker.getPosition()
  }
  addPolyline() {
    const flightPath = new google.maps.Polyline({
      path: this.path,
      geodesic: true,
      strokeColor: '#50c8ff',
      strokeWeight: 6,
      strokeOpacity: 1.0,
    });

    // flightPath.setMap(this.map);
  }
  removeAllMarkers() {
    this.markerPositions = [];
  }

  goToMenu() {
    this.navCtrl.navigateRoot(['/menu'], { replaceUrl: true });
  }

  fitToMarkers(markers) {
    // Create bounds from markers
    for (var index in markers) {
      var latlng = markers[index];
      this.bounds.extend(latlng);
    }

    // Don't zoom in too far on only one marker
    if (this.bounds.getNorthEast().equals(this.bounds.getSouthWest())) {
      var extendPoint1 = new google.maps.LatLng(
        this.bounds.getNorthEast().lat() + 0.01,
        this.bounds.getNorthEast().lng() + 0.01
      );
      var extendPoint2 = new google.maps.LatLng(
        this.bounds.getNorthEast().lat() - 0.01,
        this.bounds.getNorthEast().lng() - 0.01
      );
      this.bounds.extend(extendPoint1);
      this.bounds.extend(extendPoint2);
    }
    this.mapOptions.center = this.bounds;
    console.log(this.bounds);
  }
  fixLocation(location: { latitude: number; longitude: number }) {
    if (location) return { lat: location.latitude, lng: location.longitude };
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.stopTrack();
  }
  removeWatcharkers() {
    this.watchmarkers.pop();
    // this.watchmarkers.forEach(marker=>{
    //   marker.setMap(null);
    // })
    this.watchmarkers = [];
  }
  async stopTrack() {
    const opt = { id: await this.watch };
    Geolocation.clearWatch(opt).then((result) => {
      console.log('result of clear is', result);
    });
  }
  docEvent(e) {
    if (e.cancelable) {
      e.preventDefault();
      console.log(e);
    }
  }
}
