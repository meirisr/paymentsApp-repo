import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { MapDirectionsService } from '@angular/google-maps';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { NavController } from '@ionic/angular';
import { TravelProcessService } from 'src/app/services/travel-process.service';

const image =
    "../../../assets/images/bus.png";
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  @ViewChild('map') mapRef;
  readonly directionsResults$: Observable<
    google.maps.DirectionsResult | undefined
  >;
  @Input() height;
  @Input() path;
  @Input() nearesStationth;
  map: any;
  markers = [];
  markerPositions: google.maps.Marker[] = [];
  polylineOptions: google.maps.PolylineOptions ={};
  mapOptions: google.maps.MapOptions ={};
  markerOptions: google.maps.MarkerOptions ={}
  constructor(private router: Router,private nav: NavController,private travelProcessService:TravelProcessService) {
  }


  ngAfterViewInit() {
    console.log("hhh")
  //  this.mapRef.style.height=this.height;
    this.initMap()

  }





  initMap(){
   
    this.mapOptions= {
      disableDefaultUI: true,
      zoom: 16,
      center: { lat: 30.79476, lng: 35.18761 },
      draggable:true
      
    };
    this.markerOptions= {
      draggable: false,
    };
    
    this.polylineOptions= {
      
    };
    
    
    setTimeout(() => {
      if(this.path&&this.path?.length>=2){
        this.addPolyline()
        let startEnd=[];
        startEnd.push(this.path.shift())
        startEnd.push(this.path.pop())
        console.log(this.nearesStationth)
        this.addMarker(this.nearesStationth, 'start');
        this.fitToMarkers(this.path)
        this.printCurrentPosition();
      }
      else{
        this.printCurrentPosition();
      
      }
    
     
    
    }, 100);
    this.map= new google.maps.Map(this.mapRef.nativeElement,this.mapOptions)
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
        
        //   this.travelProcessService.getTravel({latitude:coordinates.coords.latitude,longitude:coordinates.coords.longitude},	44985002).subscribe(async(data)=>{
        //     console.log(data)
        // });
          await this.addMarker(latLng.toJSON(), 'location');
          this.mapOptions.center = latLng.toJSON();
          
        },
        async () => {}
      );
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        const latLng = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
      //   this.travelProcessService.getTravel({latitude:position.coords.latitude,longitude:position.coords.longitude},	44985002).subscribe(async(data)=>{
      //     console.log(data)
      // });
        this.addMarker(latLng.toJSON(), 'location');
        this.mapOptions.center = latLng.toJSON();
        
      
      });
    }
  };
  async addMarker(latLng, a) {

    console.log(latLng)
    const marker = new google.maps.Marker({
      map:this.map,
      position: latLng,
      icon: a =='location'?image: ''
    });
    
    this.markerPositions.push(marker);
    this.markers.push(marker);
    this.map.center=marker.getPosition()
  }
  addPolyline(){
    const flightPath = new google.maps.Polyline({
      path: this.path,
      geodesic: true,
      strokeColor: '#50c8ff',
      strokeWeight: 6,
      strokeOpacity: 1.0,
     
    });
  
    flightPath.setMap(this.map);
  }
  removeAllMarkers() {
    this.markerPositions = [];
  }

  onDragStart(event) {
    console.log(`starting`);
    event.preventDefault();
  }
  
  onDrag(event) {
    console.log('dragging');
    event.preventDefault();
  }
  
  onDragEnd(event) {
    console.log('drag end');
    event.preventDefault();
  }
  goToMenu() {
    this.nav.navigateBack('/menu',{ replaceUrl: true });
  }
  
   fitToMarkers(markers) {

    var bounds = new google.maps.LatLngBounds();

    // Create bounds from markers
    for( var index in markers ) {
        var latlng = markers[index]
        bounds.extend(latlng);
       
    }

    // Don't zoom in too far on only one marker
    if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
       var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.01, bounds.getNorthEast().lng() + 0.01);
       var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.01, bounds.getNorthEast().lng() - 0.01);
       bounds.extend(extendPoint1);
       bounds.extend(extendPoint2);
    }
  
   
     this.map.fitBounds(bounds);
    

}
}
