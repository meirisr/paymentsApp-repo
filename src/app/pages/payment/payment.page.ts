import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { from, Subject, Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { TravelProcessService } from 'src/app/services/travel-process.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { NavigateHlperService } from 'src/app/services/utils/navigate-hlper.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements AfterViewInit {
  private subscriptions: Subscription[] = [];
  @ViewChild('polyline') polylineRef: ElementRef<HTMLElement>;
  @ViewChild('paymentBody') paymentBodyRef: ElementRef<HTMLElement>;
  @ViewChild('drowerBar') drowerBarRef: ElementRef<HTMLElement>;
  mapHight: string = '100vh';
  origin;
  destination;
  nearestStation = {
    lat: 0,
    lng: 0,
  };
  coordinates: [] = [];
  unsubscribe: Subject<void> = new Subject<void>();
  apiLoaded: boolean = false;
  numOfPassengers: number = 1;
  data: any;

  constructor(
    private platform: Platform,
    private navigateService: NavigateHlperService,
    private utils: UtilsService,
    private storageService: StorageService,
    private travelProcessService: TravelProcessService
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navigateService.goToMenu();
    });
  }

  ngAfterViewInit(): void {
    
    let routeInfoSubscription = this.travelProcessService.routeInfo.subscribe(
      async (data) => {
        if (!data) return;
        console.log(data);
        this.data = data;
        this.origin = data.firstStation;
        this.destination = data.lastStation;
      },
      async (error) => {
        console.log(error);
      }
    );
    this.subscriptions.push(routeInfoSubscription);
    setTimeout(() => {
      this.utils.dismissModal();
    }, 10);
  }
  onOpenClose(){
    this.paymentBodyRef.nativeElement.classList.toggle('OpenBig');
    this.paymentBodyRef.nativeElement.classList.contains('OpenBig')? this.mapHight="40vh":this.mapHight="100vh";
    
  }
  // onMove(detail) {
  //   const position = document.getElementById('paymentBody');
  //   const top = position.getBoundingClientRect().top;
  //   if (detail.deltaY >= 0) {
  //     if (this.convertPXToVh(top) <= 80 && detail.currentY <= 640) {
  //       this.paymentBodyRef.nativeElement.style.top =
  //         this.convertPXToVh(detail.currentY) + 'vh';
  //     }
  //   } else {
  //     if (this.convertPXToVh(detail.currentY) > 9) {
  //       this.paymentBodyRef.nativeElement.style.top =
  //         this.convertPXToVh(detail.currentY) + 'vh';
  //     }
  //   }
  // }
  convertPXToVh(px: number): number {
    return 100 * (px / document.documentElement.clientHeight);
  }
  convertVhTopx(vh: number): number {
    return (vh * document.documentElement.clientWidth) / 100;
  }
  addPassengers(): void {
    this.numOfPassengers += 1;
  }
  removePassengers(): void {
    if (this.numOfPassengers > 1) {
      this.numOfPassengers -= 1;
    }
  }
  async onSubmit(): Promise<void> {
    let hotelId = await this.storageService.getHotelId();
    this.utils.presentModal('נסיעה טובה', '', 'chack');
    setTimeout(() => {
      this.utils.dismissModal();
    }, 2000);
    this.travelProcessService.isRouteValidToOrg(this.data, hotelId.value);
    this.travelProcessService.paymentTranportation(this.data, hotelId.value);
    this.navigateService.goToTravelRouteTracking();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
