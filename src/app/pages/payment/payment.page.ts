import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
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
export class PaymentPage implements AfterViewInit , OnInit {
  private subscriptions: Subscription[] = [];
  @ViewChild('polyline') polylineRef: ElementRef<HTMLElement>;
  @ViewChild('paymentBody') paymentBodyRef: ElementRef<HTMLElement>;
  @ViewChild('drowerBar') drowerBarRef: ElementRef<HTMLElement>;
  mapHight: string = '40vh';
  origin;
  hidePayment:boolean=false;
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
  ngOnInit(){
     this.storageService.getHotelId().then((data)=>{
      this.hidePayment= Number(data.value)? false:true;
     
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
  onOpenClose() {
    this.paymentBodyRef.nativeElement.classList.toggle('closeBig');
    this.paymentBodyRef.nativeElement.classList.contains('closeBig')
      ? (this.mapHight = '100vh')
      : (this.mapHight = '40vh');
  }

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
    // this.travelProcessService.isRouteValidToOrg(this.data, hotelId.value);
    this.travelProcessService.paymentTranportation(this.data, hotelId.value);
    this.navigateService.goToTravelRouteTracking();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
