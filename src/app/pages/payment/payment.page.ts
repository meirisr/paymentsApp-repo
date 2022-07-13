import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { from, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';

import { LoginService } from 'src/app/services/login.service';
import { TravelProcessService } from 'src/app/services/travel-process.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements AfterViewInit {
  @ViewChild('polyline') polylineRef: ElementRef<HTMLElement>;
  @ViewChild('paymentBody') paymentBodyRef: ElementRef<HTMLElement>;
  @ViewChild('drowerBar') drowerBarRef: ElementRef<HTMLElement>;
  mapHight = '25vh';
  origin ;
  destination ;
  nearestStation={
    lat:0,
    lng:0
  }
  coordinates: []=[];
  unsubscribe = new Subject<void>();
  apiLoaded = false;
  numOfPassengers = 1;
  

  constructor(
    private router: Router,
    private platform: Platform,
    private nav: NavController,
    private utils: UtilsService,
    private travelProcessService: TravelProcessService
  ) {
    // this.platform.backButton.subscribeWithPriority(10, () => {
    //   this.router.navigate(['/menu']);
    // });
    
  }

  ngAfterViewInit(): void {
    // let userLocation={
    //   latitude:0,
    //   longitude:0
    // }
    // this.travelProcessService.getTravel(userLocation).subscribe(async(data)=>{
    //   console.log(data)
    // },
    // async(err)=>{
    //   console.log(err)
    //   setTimeout(() => {
    //     this.nav.navigateBack('/menu',{ replaceUrl: true });
    //   }, 3000);
    // })
    
    // this.logInServer.getTravel().subscribe(async () => {
      this.coordinates = this.travelProcessService.Coordinates;
      this.origin=this.travelProcessService.firstStation;
      this.destination=this.travelProcessService.lastStation;
      console.log(this.travelProcessService.nearestStation)
      this.nearestStation.lat=this.travelProcessService?.nearestStation?.stationLocation?.lat
      this.nearestStation.lng=this.travelProcessService?.nearestStation?.stationLocation?.lon
      
     
    // }),
    // async(err)=>{
    //   console.log(err)
    // };

  }
  onMove(detail) {
    const position = document.getElementById('paymentBody');
    const top = position.getBoundingClientRect().top;
    if (detail.deltaY >= 0) {
      if (this.convertPXToVh(top) <= 80 && detail.currentY <= 640) {
        this.paymentBodyRef.nativeElement.style.top =
          this.convertPXToVh(detail.currentY) + 'vh';
      }
    } else {
      if (this.convertPXToVh(detail.currentY) > 9) {
        this.paymentBodyRef.nativeElement.style.top =
          this.convertPXToVh(detail.currentY) + 'vh';
      }
    }
  }
  convertPXToVh(px) {
    return 100 * (px / document.documentElement.clientHeight);
  }
  convertVhTopx(vh) {
    return (vh * document.documentElement.clientWidth) / 100;
  }
  addPassengers() {
    this.numOfPassengers += 1;
  }
  removePassengers() {
    if (this.numOfPassengers > 1) {
      this.numOfPassengers -= 1;
    }
  }
  async onSubmit() {
    let loader=this.utils.showLoader();
    from(this.travelProcessService.paymentTranportation()).subscribe(async(data)=>{
      this.utils.dismissLoader(loader)
     if(data.querySuccessful){
      this.nav.navigateForward('/travel-route-tracking', { animationDirection: 'forward', animated: true })
      await this.utils.presentModal('נסיעה טובה','החיוב בוצע בהצלחה');
     }else{
      await this.utils.presentModal('שגיאה','המערכת לא הצליחה לבצע חיוב');
     }
    },
    err=>{
      this.utils.dismissLoader(loader)
      console.log(err)
    })
   
    // this.router.navigate(['/travel-route-tracking']);
  }
}
