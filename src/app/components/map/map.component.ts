import {AfterViewInit,Component,Input,NgZone,ViewChild} from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { Observable, Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';
import { TravelProcessService } from 'src/app/services/travel-process.service';

const image: string = '../../../assets/images/bus.png';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  private subscriptions: Subscription[] = [];

  @ViewChild('map') mapRef;
  readonly directionsResults$: Observable<
    google.maps.DirectionsResult | undefined
  >;
  @Input() height: string;
  @Input() path: [];
  @Input() nearesStationth;

  public lat: any;
  public lng: any;
  watch: any;
  bounds = new google.maps.LatLngBounds();
  watchMarker = null;
  markers = [];
  watchmarkers = [];
  markerPositions: google.maps.Marker[] = [];
  polylineOptions: google.maps.PolylineOptions = {};
  mapOptions: google.maps.MapOptions = {};
  markerOptions: google.maps.MarkerOptions = {};
  watchmarkerOptions: google.maps.MarkerOptions = {};
  constructor(
    private navCtrl: NavController,
    private travelProcessService: TravelProcessService,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit() {
    this.initMap();
    document.addEventListener('touchmove', this.docEvent);
    document.addEventListener('touchstart', this.docEvent);
  }

  initMap() {
    this.mapOptions = {
      disableDefaultUI: true,
      zoom: 12,
      center: { lat: 30.79476, lng: 35.18761 },
      // draggable:false
    };
    this.watchmarkerOptions = {
      draggable: false,
      icon: image,
    };

    this.polylineOptions = {
      strokeColor: '#50c8ff',
      strokeWeight: 6,
      strokeOpacity: 1.0,
    };
    console.log(this.mapRef);

    setTimeout(() => {
      let routeInfoSubscription = this.travelProcessService.routeInfo.subscribe(
        async (data) => {
          if (!data) return;

          this.path = data.Coordinates;
          this.nearesStationth = this.fixLocation(
            data.nearestStation?.stationLocation
          );
        },
        async (error) => {
          console.log(error);
        }
      );

      this.subscriptions.push(routeInfoSubscription);
      // this.addPolyline()
      if (this.path && this.path.length >= 2) {
        this.addMarker(this.nearesStationth);
        this.fitToMarkers(this.path);
        // this.markers.push(this.nearesStationth)
        // console.log(this.nearesStationth)
        // this.mapOptions.center=this.nearesStationth.toJSON()
        // this.printCurrentPosition();
      } else {
        // this.printCurrentPosition();
      }
    }, 100);
    // console.log(this.mapRef._elementRef)
    //  this.map= new google.maps.Map(this.mapRef.nativeElement,this.mapOptions)

    console.log('SSSS');
    this.printCurrentPosition();
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
          //     let watchMarker= this.addMarker(latLng.toJSON(), 'location');
          //     this.markers.push(latLng.toJSON());

          //  console.log( this.markers)
          //  this.map.panTo(latLng.toJSON());
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
    this.navCtrl.navigateRoot(['menu'], { replaceUrl: true });
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

    this.mapRef.fitBounds(this.bounds);
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
    }
  }
}
