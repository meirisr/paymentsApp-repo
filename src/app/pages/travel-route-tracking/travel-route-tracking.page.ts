import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { PopupModalComponent } from '../../components/popup-modal/popup-modal.component';
import { Gesture, GestureController, Platform } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { TravelProcessService } from 'src/app/services/travel-process.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-travel-route-tracking',
  templateUrl: './travel-route-tracking.page.html',
  styleUrls: ['./travel-route-tracking.page.scss'],
})
export class TravelRouteTrackingPage implements OnInit {
  @ViewChild('polyline') polylineRef: ElementRef<HTMLElement>;
  @ViewChild('travelBody') travelBodyRef: ElementRef<HTMLElement>;
  @ViewChild('drowerBar') drowerBarRef: ElementRef<HTMLElement>;
  @ViewChild('dated') datedRef: ElementRef<HTMLElement>;
  mapHight = '100vh';
  startHight = 75;
  minHight;
  coordinates: []=[];
  origin;
  destination;
  nearestStation={
    lat:0,
    lng:0
  }

  
  constructor(
    private plt: Platform,
    private gestureCtrl: GestureController,
    private logInServer: LoginService,
    private modalController: ModalController,
    private router: Router,
    private platform: Platform,
    private nav: NavController,
    private travelProcessService: TravelProcessService
  ) {
    // this.platform.backButton.subscribeWithPriority(10, () => {
    //   this.nav.navigateBack('/menu', { replaceUrl: true });
    // });
  }

  ngOnInit() {
    // from(this.travelProcessService.paymentTranportation()).subscribe(async(data)=>{
    //   console.log(data)
    // })
  }
  ngAfterViewInit(): void {
    this.coordinates = this.travelProcessService.Coordinates;
    this.origin=this.travelProcessService?.firstStation;
    this.destination=this.travelProcessService?.lastStation;
    this.nearestStation.lat=this.travelProcessService?.nearestStation?.stationLocation?.lat
    this.nearestStation.lng=this.travelProcessService?.nearestStation?.stationLocation?.lnt
    
    // if (this.logInServer.Coordinates.length < 1) {
      // this.logInServer.getTravel().subscribe(async () => {
      //   this.coordinates = this.logInServer.Coordinates;
      //   this.origin=this.logInServer.firstStation;
      //   this.destination=this.logInServer.lastStation;
      // }),
      //   async (err) => {
      //     console.log(err);
      //   };
    // }else{
    //   this.coordinates = this.logInServer.Coordinates;
    //   this.origin=this.logInServer.firstStation;
    //   this.destination=this.logInServer.lastStation;
    // }
  }

  ionViewDidEnter(): void {
    if(this.coordinates.length>1){
      this.travelBodyRef.nativeElement.style.top = this.startHight + 'vh';
      this.minHight = this.plt.height();
  
      const gesture: Gesture = this.gestureCtrl.create(
        {
          el: this.travelBodyRef.nativeElement,
          threshold: 0,
          gestureName: 'my-gesture',
          onMove: (ev) => this.onMove(ev),
          onEnd: (ev) => this.onEnd(ev),
        },
        true
      );
      gesture.enable();
    }
   
  }
  onMove(detail) {
    const position = document.getElementById('travelBody');

    const top = position.getBoundingClientRect().top;

    if (detail.currentY > this.minHight - 40 || detail.currentY < 40) {
      return;
    }

    this.travelBodyRef.nativeElement.style.top =
      this.convertPXToVh(detail.currentY) + 'vh';
  }
  onEnd(detail) {}
  convertPXToVh(px) {
    return 100 * (px / document.documentElement.clientHeight);
  }
  convertVhTopx(vh) {
    return (vh * document.documentElement.clientWidth) / 100;
  }


}
